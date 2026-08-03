// File: apps/api/Application/Services/PaymentService.cs

using api.Application.DTOs.Payment;
using api.Application.Interfaces;
using api.Infrastructure.Services.Email;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Domain.Exceptions;
using api.Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Razorpay.Api;
using System.Security.Cryptography;
using System.Text;
using PaymentEntity = api.Domain.Entities.Payment;

namespace api.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;
    private readonly RazorpaySettings _razorpaySettings;
    private readonly ILogger<PaymentService> _logger;
    private readonly IEmailService _emailService;
    public PaymentService(
        IUnitOfWork unitOfWork,
        ITenantContext tenantContext,
        IOptions<RazorpaySettings> razorpaySettings,
        ILogger<PaymentService> logger,
          IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
        _razorpaySettings = razorpaySettings.Value;
        _logger = logger;
        _emailService = emailService;
    }

    // ==========================================
    // 1. CREATE RAZORPAY ORDER
    // ==========================================
    public async Task<CreatePaymentOrderResponse> CreateRazorpayOrderAsync(
        Guid userId,
        CreatePaymentOrderRequest request)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId)
            ?? throw new NotFoundException($"Order not found: {request.OrderId}");

        if (order.UserId != userId)
            throw new ForbiddenException("You don't have access to this order");

        if (order.PaymentStatus == PaymentStatus.Paid)
            throw new BadRequestException("Order is already paid");

        if (order.Status == OrderStatus.Cancelled)
            throw new BadRequestException("Cannot pay for cancelled order");

        if (order.PaymentMethod != PaymentMethod.Razorpay)
            throw new BadRequestException("This order is not set for online payment");

        var user = await _unitOfWork.Users.GetByIdAsync(userId)
            ?? throw new NotFoundException($"User not found: {userId}");

        try
        {
            var client = new RazorpayClient(
                _razorpaySettings.KeyId,
                _razorpaySettings.KeySecret
            );

            int amountInPaise = (int)(order.Total * 100);

            var options = new Dictionary<string, object>
            {
                { "amount", amountInPaise },
                { "currency", _razorpaySettings.Currency },
                { "receipt", order.OrderNumber },
                { "payment_capture", 1 },
                { "notes", new Dictionary<string, string>
                    {
                        { "order_id", order.Id.ToString() },
                        { "order_number", order.OrderNumber },
                        { "user_id", userId.ToString() }
                    }
                }
            };

            var razorpayOrder = client.Order.Create(options);
            string razorpayOrderId = razorpayOrder["id"].ToString();
            var payment = new api.Domain.Entities.Payment
            {
                Id = Guid.NewGuid(),
                TenantId = _tenantContext.TenantId
        ?? throw new BadRequestException("Tenant context not set"),
                OrderId = order.Id,
                UserId = userId,
                RazorpayOrderId = razorpayOrderId,
                Amount = order.Total,
                Currency = _razorpaySettings.Currency,
                Method = PaymentMethod.Razorpay,
                Status = PaymentStatus.Pending,
                PaymentGateway = "Razorpay",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Payments.AddAsync(payment);

            order.PaymentGatewayOrderId = razorpayOrderId;
            order.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            _logger.LogInformation(
                "Razorpay order created: {RazorpayOrderId} for order {OrderNumber}",
                razorpayOrderId, order.OrderNumber
            );

            return new CreatePaymentOrderResponse
            {
                RazorpayOrderId = razorpayOrderId,
                RazorpayKeyId = _razorpaySettings.KeyId,
                Amount = order.Total,
                AmountInPaise = amountInPaise,
                Currency = _razorpaySettings.Currency,
                OrderNumber = order.OrderNumber,
                CustomerName = order.ShippingFullName,
                CustomerEmail = user.Email,
                CustomerPhone = order.ShippingPhone
            };
        }
        catch (Exception ex) when (ex is not NotFoundException
                                   and not ForbiddenException
                                   and not BadRequestException)
        {
            _logger.LogError(ex, "Failed to create Razorpay order for {OrderId}", order.Id);
            throw new BadRequestException("Failed to initialize payment. Please try again.");
        }
    }

    // ==========================================
    // 2. VERIFY PAYMENT (CRITICAL SECURITY!)
    // ==========================================
    public async Task<VerifyPaymentResponse> VerifyPaymentAsync(
        Guid userId,
        VerifyPaymentRequest request)
    {
        var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(request.OrderId)
            ?? throw new NotFoundException($"Order not found: {request.OrderId}");

        if (order.UserId != userId)
            throw new ForbiddenException("You don't have access to this order");

        if (order.PaymentStatus == PaymentStatus.Paid)
        {
            return new VerifyPaymentResponse
            {
                Success = true,
                OrderNumber = order.OrderNumber,
                Message = "Payment already verified",
                PaymentId = order.PaymentTransactionId ?? string.Empty
            };
        }

        var payment = await _unitOfWork.Payments.GetByRazorpayOrderIdAsync(request.RazorpayOrderId)
            ?? throw new NotFoundException("Payment record not found");

        if (order.PaymentGatewayOrderId != request.RazorpayOrderId)
        {
            _logger.LogWarning(
                "Razorpay order ID mismatch. Expected: {Expected}, Got: {Got}",
                order.PaymentGatewayOrderId, request.RazorpayOrderId
            );
            throw new BadRequestException("Invalid payment details");
        }

        bool isSignatureValid = VerifyRazorpaySignature(
            request.RazorpayOrderId,
            request.RazorpayPaymentId,
            request.RazorpaySignature
        );

        if (!isSignatureValid)
        {
            _logger.LogWarning(
                "⚠️ INVALID SIGNATURE for order {OrderId}. Possible fraud!",
                order.Id
            );

            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = "Invalid signature";
            payment.FailedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;

            order.PaymentStatus = PaymentStatus.Failed;
            order.UpdatedAt = DateTime.UtcNow;

            await _unitOfWork.SaveChangesAsync();

            throw new BadRequestException("Payment verification failed. Invalid signature.");
        }

        // Signature valid — do EVERYTHING in transaction
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 1. Update Payment record
            payment.Status = PaymentStatus.Paid;
            payment.RazorpayPaymentId = request.RazorpayPaymentId;
            payment.RazorpaySignature = request.RazorpaySignature;
            payment.PaidAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;

            // 2. Update Order
            order.PaymentStatus = PaymentStatus.Paid;
            order.Status = OrderStatus.Confirmed;
            order.PaymentTransactionId = request.RazorpayPaymentId;
            order.PaymentSignature = request.RazorpaySignature;
            order.PaidAt = DateTime.UtcNow;
            order.ConfirmedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

            // 3. NOW deduct stock (was pending until payment)
            if (order.Items != null)
            {
                foreach (var item in order.Items)
                {
                    var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity -= item.Quantity;
                        if (product.StockQuantity < 0) product.StockQuantity = 0;
                        product.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

            // 4. NOW clear the user's cart
            var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);
            if (cart != null && cart.Items != null)
            {
                foreach (var item in cart.Items.Where(i => !i.IsDeleted))
                {
                    item.IsDeleted = true;
                    item.UpdatedAt = DateTime.UtcNow;
                }

                // Clear coupon from cart
                cart.CouponId = null;
                cart.CouponCode = null;
                cart.CouponDiscount = 0;
                cart.UpdatedAt = DateTime.UtcNow;
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            _logger.LogInformation(
                "Payment verified for order {OrderNumber}. Payment ID: {PaymentId}",
                order.OrderNumber, request.RazorpayPaymentId
            );

            // 5. Send confirmation email (background)
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId);
                if (user != null)
                {
                    var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")
                                   ?? "http://localhost:3000";

                    var emailData = new OrderEmailData
                    {
                        OrderNumber = order.OrderNumber,
                        Total = order.Total,
                        TotalItems = order.Items?.Sum(i => i.Quantity) ?? 0,
                        PaymentMethod = "Online Payment (Razorpay)",
                        OrderDate = order.CreatedAt,
                        OrderUrl = $"{frontendUrl}/account/orders/{order.Id}",
                        ShippingAddress = FormatAddress(order)
                    };

                    var userEmail = user.Email;
                    var userName = user.FullName;

                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            await _emailService.SendOrderPlacedEmailAsync(userEmail, userName, emailData);
                            _logger.LogInformation("Order confirmation email sent for {OrderNumber}", order.OrderNumber);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Failed to send order email for {OrderNumber}", order.OrderNumber);
                        }
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Email preparation failed for order {OrderNumber}", order.OrderNumber);
                // Don't fail the payment for email issues
            }

            return new VerifyPaymentResponse
            {
                Success = true,
                OrderNumber = order.OrderNumber,
                Message = "Payment successful! Your order is confirmed.",
                PaymentId = request.RazorpayPaymentId
            };
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Failed to update order after payment verification");
            throw;
        }
    }

    // ==========================================
    // Helper: Format shipping address
    // ==========================================
    private string FormatAddress(Domain.Entities.Order order)
    {
        var parts = new List<string>
    {
        order.ShippingFullName,
        order.ShippingAddressLine1
    };

        if (!string.IsNullOrEmpty(order.ShippingAddressLine2))
            parts.Add(order.ShippingAddressLine2);

        if (!string.IsNullOrEmpty(order.ShippingLandmark))
            parts.Add($"Near {order.ShippingLandmark}");

        parts.Add($"{order.ShippingCity}, {order.ShippingState} - {order.ShippingPincode}");
        parts.Add(order.ShippingCountry);
        parts.Add($"📞 {order.ShippingPhone}");

        return string.Join("\n", parts);
    }

    // ==========================================
    // 3. HANDLE PAYMENT FAILURE
    // ==========================================
    public async Task HandlePaymentFailureAsync(
        Guid userId,
        PaymentFailureRequest request)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId);

        if (order == null || order.UserId != userId)
        {
            _logger.LogWarning(
                "Payment failure for invalid order {OrderId} by user {UserId}",
                request.OrderId, userId
            );
            return;
        }

        if (order.PaymentStatus == PaymentStatus.Paid)
            return;

        if (!string.IsNullOrEmpty(request.RazorpayOrderId))
        {
            var payment = await _unitOfWork.Payments.GetByRazorpayOrderIdAsync(request.RazorpayOrderId);
            if (payment != null)
            {
                payment.Status = PaymentStatus.Failed;
                payment.FailureReason = request.ErrorDescription;
                payment.ErrorCode = request.ErrorCode;
                payment.FailedAt = DateTime.UtcNow;
                payment.UpdatedAt = DateTime.UtcNow;
            }
        }

        order.PaymentStatus = PaymentStatus.Failed;
        order.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();

        _logger.LogWarning(
            "Payment failed for order {OrderNumber}. Code: {Code}, Desc: {Desc}",
            order.OrderNumber, request.ErrorCode, request.ErrorDescription
        );
    }

    // ==========================================
    // 🔒 SIGNATURE VERIFICATION
    // ==========================================
    private bool VerifyRazorpaySignature(
        string razorpayOrderId,
        string razorpayPaymentId,
        string razorpaySignature)
    {
        try
        {
            string payload = $"{razorpayOrderId}|{razorpayPaymentId}";

            byte[] secretBytes = Encoding.UTF8.GetBytes(_razorpaySettings.KeySecret);
            byte[] payloadBytes = Encoding.UTF8.GetBytes(payload);

            using var hmac = new HMACSHA256(secretBytes);
            byte[] hashBytes = hmac.ComputeHash(payloadBytes);

            string computedSignature = Convert.ToHexString(hashBytes).ToLower();

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computedSignature),
                Encoding.UTF8.GetBytes(razorpaySignature.ToLower())
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Signature verification error");
            return false;
        }
    }
}