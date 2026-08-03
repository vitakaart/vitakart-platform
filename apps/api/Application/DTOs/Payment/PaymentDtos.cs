// File: apps/api/Application/DTOs/Payment/PaymentDtos.cs
// DTOs for Razorpay payment flow

namespace api.Application.DTOs.Payment;

// ==========================================
// 1. CREATE PAYMENT ORDER
// Frontend → Backend: "Order ke liye Razorpay order banao"
// ==========================================
public class CreatePaymentOrderRequest
{
    public Guid OrderId { get; set; }
}

// Backend → Frontend: "Ye Razorpay order details lo"
public class CreatePaymentOrderResponse
{
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayKeyId { get; set; } = string.Empty;
    public decimal Amount { get; set; }              // Amount in ₹
    public int AmountInPaise { get; set; }           // Amount in paise (for Razorpay)
    public string Currency { get; set; } = "INR";
    public string OrderNumber { get; set; } = string.Empty;
    
    // Prefill data for Razorpay checkout
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
}

// ==========================================
// 2. VERIFY PAYMENT
// Frontend → Backend: "Payment ho gaya, verify karo"
// ==========================================
public class VerifyPaymentRequest
{
    public Guid OrderId { get; set; }
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayPaymentId { get; set; } = string.Empty;
    public string RazorpaySignature { get; set; } = string.Empty;
}

// Backend → Frontend: "Payment verified, order confirmed"
public class VerifyPaymentResponse
{
    public bool Success { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string PaymentId { get; set; } = string.Empty;
}

// ==========================================
// 3. PAYMENT FAILURE
// Frontend → Backend: "Payment fail ho gaya"
// ==========================================
public class PaymentFailureRequest
{
    public Guid OrderId { get; set; }
    public string? RazorpayOrderId { get; set; }
    public string? ErrorCode { get; set; }
    public string? ErrorDescription { get; set; }
}