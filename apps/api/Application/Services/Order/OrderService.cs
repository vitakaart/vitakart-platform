// File: apps/api/Application/Services/Order/OrderService.cs
// Order service with coupon tracking + email notifications

using api.Application.DTOs;
using api.Application.DTOs.Order;
using api.Application.Interfaces;
using api.Application.Services.Order.Helpers;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Domain.Exceptions;


namespace api.Application.Services.Order;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;
    private readonly IEmailService _emailService;
    private readonly OrderCalculator _calculator;
    private readonly OrderNumberGenerator _numberGenerator;
    private readonly OrderMapper _mapper;

    public OrderService(
        IUnitOfWork unitOfWork,
        ITenantContext tenantContext,
        IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
        _emailService = emailService;
        _calculator = new OrderCalculator();
        _numberGenerator = new OrderNumberGenerator(unitOfWork);
        _mapper = new OrderMapper();
    }

    // ==========================================
    // CREATE ORDER (CHECKOUT)
    // ==========================================
    public async Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto)
    {
        // 1. Idempotency check
        if (!string.IsNullOrWhiteSpace(dto.IdempotencyKey))
        {
            var existing = await _unitOfWork.Orders
                .GetByIdempotencyKeyAsync(dto.IdempotencyKey, userId);
            if (existing != null) return _mapper.ToDto(existing);
        }

        // 2. Validate address
        OrderAddressValidator.Validate(dto);

        // 3. Get & validate cart
        var cart = await GetValidatedCartAsync(userId);
        var cartItems = cart.Items.Where(i => !i.IsDeleted).ToList();

        // 4. Validate stock
        ValidateStock(cartItems);

        // 5. Calculate totals (with coupon discount from cart)
        var totals = _calculator.Calculate(cartItems);

        // Override coupon discount from cart if applied
        if (cart.CouponId.HasValue && cart.CouponDiscount > 0)
        {
            totals.CouponDiscount = cart.CouponDiscount;
            totals.Total = totals.Subtotal - totals.TotalDiscount + totals.ShippingFee + totals.TaxAmount - cart.CouponDiscount;

            if (totals.Total < 0) totals.Total = 0;
        }

        //  Check if online payment (Razorpay)
        bool isOnlinePayment = dto.PaymentMethod == PaymentMethod.Razorpay;

        // 6. Create order (transaction)
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            var order = await CreateOrderEntityAsync(userId, dto, cart, totals);
            //  Deduct stock ONLY for COD (immediate payment)
            // Razorpay: Stock deducted AFTER payment verification
            await CreateOrderItemsAsync(order, cartItems, deductStock: !isOnlinePayment);

            //  ONLY for COD: Track coupon + clear cart + deduct stock
            // For Razorpay: These happen AFTER payment verification
            if (!isOnlinePayment)
            {
                await TrackCouponUsageAsync(userId, cart, order);
                await ClearCartAsync(cart, cartItems);
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            var createdOrder = await _unitOfWork.Orders.GetOrderWithItemsAsync(order.Id);

            //  ONLY send confirmation email for COD orders
            // For Razorpay: Email sent AFTER payment verification
            if (!isOnlinePayment)
            {
                var user = await _unitOfWork.Users.GetByIdAsync(order.UserId);

                if (user != null && createdOrder != null)
                {
                    var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")
                                   ?? "http://localhost:3000";

                    var emailData = new OrderEmailData
                    {
                        OrderNumber = createdOrder.OrderNumber,
                        Total = createdOrder.Total,
                        TotalItems = createdOrder.Items?.Sum(i => i.Quantity) ?? 0,
                        PaymentMethod = createdOrder.PaymentMethod.ToString(),
                        OrderDate = createdOrder.CreatedAt,
                        OrderUrl = $"{frontendUrl}/account/orders/{createdOrder.Id}",
                        ShippingAddress = FormatAddress(createdOrder)
                    };

                    var userEmail = user.Email;
                    var userName = user.FullName;

                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            Console.WriteLine($"📧 Sending order email for {emailData.OrderNumber}...");
                            await _emailService.SendOrderPlacedEmailAsync(userEmail, userName, emailData);
                            Console.WriteLine($" Order email sent for {emailData.OrderNumber}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"❌ Order email failed: {ex.Message}");
                        }
                    });
                }
            }

            return _mapper.ToDto(createdOrder!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }




    // ==========================================
    // GET ORDER BY ID
    // ==========================================
    public async Task<OrderDto> GetOrderByIdAsync(Guid userId, Guid orderId)
    {
        var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);
        EnsureOrderAccess(order, userId);
        return _mapper.ToDto(order!);
    }

    // ==========================================
    // GET ORDER BY NUMBER
    // ==========================================
    public async Task<OrderDto> GetOrderByNumberAsync(Guid userId, string orderNumber)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
            throw new ValidationException("Order number is required");

        var order = await _unitOfWork.Orders.GetByOrderNumberAsync(orderNumber.Trim());
        EnsureOrderAccess(order, userId);
        return _mapper.ToDto(order!);
    }

    // ==========================================
    // GET USER'S ORDERS (Paginated + Date Filter)
    // ==========================================
    public async Task<PaginatedOrdersDto> GetUserOrdersAsync(
        Guid userId,
        int page = 1,
        int pageSize = 10,
        OrderStatus? statusFilter = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var (orders, totalCount) = await _unitOfWork.Orders
            .GetUserOrdersAsync(userId, page, pageSize, statusFilter, fromDate, toDate);

        return new PaginatedOrdersDto
        {
            Orders = orders.Select(_mapper.ToListDto).ToList(),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
        };
    }

    // ==========================================
    // CANCEL ORDER
    // ==========================================
    public async Task<OrderDto> CancelOrderAsync(Guid userId, Guid orderId, string? reason = null)
    {
        var order = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);
        EnsureOrderAccess(order, userId);

        // Can only cancel Pending or Confirmed
        if (order!.Status != OrderStatus.Pending && order.Status != OrderStatus.Confirmed)
        {
            throw new ValidationException(
                $"Cannot cancel order in '{order.Status}' status");
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {


            // Update order
            order.Status = OrderStatus.Cancelled;
            order.CancellationReason = reason?.Trim() ?? "Cancelled by customer";
            order.CancelledBy = "Customer";
            order.CancelledAt = DateTime.UtcNow;

            if (order.PaymentStatus == PaymentStatus.Paid)
                order.PaymentStatus = PaymentStatus.Refunded;

            _unitOfWork.Orders.Update(order);

            // Restore stock
            await RestoreStockAsync(order);

            //  Refund coupon usage (so user can use again)
            await RefundCouponUsageAsync(order);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            var updated = await _unitOfWork.Orders.GetOrderWithItemsAsync(orderId);

            //  Fetch user + prepare data BEFORE background task
            var user = await _unitOfWork.Users.GetByIdAsync(order.UserId);

            if (user != null && updated != null)
            {
                var emailData = new OrderEmailData
                {
                    OrderNumber = updated.OrderNumber,
                    Total = updated.Total,
                    TotalItems = updated.Items?.Sum(i => i.Quantity) ?? 0,
                    PaymentMethod = updated.PaymentMethod.ToString(),
                    OrderDate = updated.CreatedAt,
                    OrderUrl = "",
                    ShippingAddress = FormatAddress(updated),
                    CancellationReason = updated.CancellationReason
                };

                var userEmail = user.Email;
                var userName = user.FullName;

                _ = Task.Run(async () =>
                {
                    try
                    {
                        Console.WriteLine($"📧 Sending cancellation email for {emailData.OrderNumber}...");
                        await _emailService.SendOrderCancelledEmailAsync(userEmail, userName, emailData);
                        Console.WriteLine($" Cancellation email sent for {emailData.OrderNumber}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Cancellation email failed: {ex.Message}");
                    }
                });
            }

            return _mapper.ToDto(updated!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    // Get cart and ensure it's not empty
    private async Task<Cart> GetValidatedCartAsync(Guid userId)
    {
        var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);

        if (cart == null || cart.Items == null || !cart.Items.Any(i => !i.IsDeleted))
            throw new ValidationException("Your cart is empty");

        return cart;
    }

    // Validate stock for all cart items
    private void ValidateStock(List<CartItem> cartItems)
    {
        foreach (var item in cartItems)
        {
            if (item.Product == null)
                throw new ValidationException("A product in your cart is no longer available");

            if (!item.Product.IsActive)
                throw new ValidationException($"'{item.Product.Name}' is no longer available");

            if (item.Product.StockQuantity < item.Quantity)
                throw new ValidationException(
                    $"'{item.Product.Name}' has only {item.Product.StockQuantity} in stock");
        }
    }

    // Create Order entity
    private async Task<api.Domain.Entities.Order> CreateOrderEntityAsync(
        Guid userId, CreateOrderDto dto, Cart cart, OrderCalculator.OrderTotals totals)
    {
        var orderNumber = await _numberGenerator.GenerateAsync();

        var order = new api.Domain.Entities.Order
        {
            UserId = userId,
            OrderNumber = orderNumber,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            PaymentMethod = dto.PaymentMethod,

            Subtotal = totals.Subtotal,
            TotalDiscount = totals.TotalDiscount,
            ShippingFee = totals.ShippingFee,
            TaxAmount = totals.TaxAmount,
            CouponCode = cart.CouponCode ?? dto.CouponCode,
            CouponDiscount = totals.CouponDiscount,
            Total = totals.Total,

            ShippingFullName = dto.FullName.Trim(),
            ShippingPhone = dto.Phone.Trim(),
            ShippingAddressLine1 = dto.AddressLine1.Trim(),
            ShippingAddressLine2 = dto.AddressLine2?.Trim(),
            ShippingLandmark = dto.Landmark?.Trim(),
            ShippingCity = dto.City.Trim(),
            ShippingState = dto.State.Trim(),
            ShippingPincode = dto.Pincode.Trim(),
            ShippingCountry = dto.Country?.Trim() ?? "India",

            CustomerNotes = dto.CustomerNotes?.Trim(),
            IdempotencyKey = dto.IdempotencyKey,
        };

        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();
        return order;
    }


    // Create OrderItems + optionally deduct stock (COD only)
    // For Razorpay: Stock deducted AFTER payment verification
    private async Task CreateOrderItemsAsync(
        api.Domain.Entities.Order order,
        List<CartItem> cartItems,
        bool deductStock)  //  NEW PARAMETER
    {
        foreach (var cartItem in cartItems)
        {
            var product = cartItem.Product!;
            var (effectivePrice, totalPrice, savedAmount) = _calculator.CalculateItemTotals(
                cartItem.UnitPrice, cartItem.DiscountPrice, cartItem.Quantity);

            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = product.Id,

                ProductName = product.Name,
                ProductSlug = product.Slug,
                ProductImage = product.ImageUrl,
                ProductBrand = product.Brand,
                ProductSku = product.Sku,

                UnitPrice = cartItem.UnitPrice,
                DiscountPrice = cartItem.DiscountPrice,
                EffectivePrice = effectivePrice,
                Quantity = cartItem.Quantity,
                TotalPrice = totalPrice,
                SavedAmount = savedAmount,
            };

            await _unitOfWork.Orders.AddOrderItemAsync(orderItem);

            //  ONLY deduct stock for COD (immediate payment)
            // For Razorpay: Stock deducted AFTER payment success
            if (deductStock)
            {
                var success = await _unitOfWork.Products.TryDeductStockAsync(
                    product.Id,
                    cartItem.Quantity
                );

                if (!success)
                {
                    throw new ValidationException(
                        $"'{product.Name}' is out of stock. Please refresh and try again.");
                }
            }
        }
    }

    // ==========================================
    //  TRACK COUPON USAGE (After order placed)
    // ==========================================
    private async Task TrackCouponUsageAsync(Guid userId, Cart cart, api.Domain.Entities.Order order)
    {
        // Only track if coupon was applied
        if (!cart.CouponId.HasValue || cart.CouponDiscount <= 0)
        {
            return;
        }

        // Create usage record
        var couponUsage = new CouponUsage
        {
            TenantId = _tenantContext.TenantId!.Value,
            CouponId = cart.CouponId.Value,
            UserId = userId,
            OrderId = order.Id,
            DiscountAmount = cart.CouponDiscount
        };

        await _unitOfWork.CouponUsages.AddAsync(couponUsage);

        // Increment total usage count on coupon
        var coupon = await _unitOfWork.Coupons.GetByIdAsync(cart.CouponId.Value);
        if (coupon != null)
        {
            coupon.UsageCount++;
            _unitOfWork.Coupons.Update(coupon);
        }
    }

    // ==========================================
    //  REFUND COUPON USAGE (On order cancel)
    // Soft delete usage so user can use coupon again
    // ==========================================
    private async Task RefundCouponUsageAsync(api.Domain.Entities.Order order)
    {
        // Skip if no coupon was used
        if (string.IsNullOrEmpty(order.CouponCode) || order.CouponDiscount <= 0)
        {
            return;
        }

        // Find usage record for this order
        var usages = await _unitOfWork.CouponUsages
            .FindAsync(u => u.OrderId == order.Id);

        foreach (var usage in usages)
        {
            _unitOfWork.CouponUsages.SoftDelete(usage);

            // Decrement coupon usage count
            var coupon = await _unitOfWork.Coupons.GetByIdAsync(usage.CouponId);
            if (coupon != null && coupon.UsageCount > 0)
            {
                coupon.UsageCount--;
                _unitOfWork.Coupons.Update(coupon);
            }
        }
    }

    // Clear cart after successful order
    private Task ClearCartAsync(Cart cart, List<CartItem> cartItems)
    {
        foreach (var item in cartItems)
        {
            item.IsDeleted = true;
            _unitOfWork.Carts.UpdateCartItem(item);
        }

        // Clear coupon completely
        cart.CouponCode = null;
        cart.CouponId = null;
        cart.CouponDiscount = 0;
        _unitOfWork.Carts.Update(cart);
        return Task.CompletedTask;
    }

    // Restore stock on cancellation (atomic)
    private async Task RestoreStockAsync(api.Domain.Entities.Order order)
    {
        foreach (var item in order.Items.Where(i => !i.IsDeleted))
        {
            //  ATOMIC stock restoration
            await _unitOfWork.Products.RestoreStockAsync(
                item.ProductId,
                item.Quantity
            );
        }
    }

    // Security: ensure order exists and belongs to user
    private void EnsureOrderAccess(api.Domain.Entities.Order? order, Guid userId)
    {
        if (order == null)
            throw new NotFoundException("Order not found");

        if (order.UserId != userId)
            throw new UnauthorizedException("You cannot access this order");
    }



    // Format shipping address for emails (HTML)
    private static string FormatAddress(api.Domain.Entities.Order order)
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
        parts.Add($"📞 {order.ShippingPhone}");

        return string.Join("<br>", parts);
    }
}