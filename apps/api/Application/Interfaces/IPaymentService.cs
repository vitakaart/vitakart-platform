// File: apps/api/Application/Interfaces/IPaymentService.cs
// Payment service contract — Razorpay integration

using api.Application.DTOs.Payment;

namespace api.Application.Interfaces;

public interface IPaymentService
{
    /// <summary>
    /// Creates a Razorpay order for an existing Vitakart order.
    /// Called when user clicks "Pay Online" on checkout.
    /// </summary>
    /// <param name="userId">Logged-in user ID</param>
    /// <param name="request">Order ID to create payment for</param>
    /// <returns>Razorpay order details for frontend checkout</returns>
    Task<CreatePaymentOrderResponse> CreateRazorpayOrderAsync(
        Guid userId, 
        CreatePaymentOrderRequest request);

    /// <summary>
    /// Verifies Razorpay payment signature and marks order as paid.
    /// Called after user completes payment on Razorpay checkout.
    /// SECURITY: Signature verification is critical to prevent fake payments.
    /// </summary>
    /// <param name="userId">Logged-in user ID</param>
    /// <param name="request">Payment details from Razorpay callback</param>
    /// <returns>Success status with order details</returns>
    Task<VerifyPaymentResponse> VerifyPaymentAsync(
        Guid userId, 
        VerifyPaymentRequest request);

    /// <summary>
    /// Records payment failure for tracking and analytics.
    /// Called when Razorpay checkout returns error.
    /// </summary>
    /// <param name="userId">Logged-in user ID</param>
    /// <param name="request">Failure details</param>
    Task HandlePaymentFailureAsync(
        Guid userId, 
        PaymentFailureRequest request);
}