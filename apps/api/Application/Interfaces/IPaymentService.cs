// File: apps/api/Application/Interfaces/IPaymentService.cs
// Payment service contract — Razorpay integration

using api.Application.DTOs.Payment;

namespace api.Application.Interfaces;


public interface IPaymentService
{
    Task<CreatePaymentOrderResponse> CreateRazorpayOrderAsync(
        Guid userId, CreatePaymentOrderRequest request);
    
    Task<VerifyPaymentResponse> VerifyPaymentAsync(
        Guid userId, VerifyPaymentRequest request);
    
    Task HandlePaymentFailureAsync(
        Guid userId, PaymentFailureRequest request);
    
    // NEW
    Task<bool> HandleWebhookAsync(
        string requestBody, string razorpaySignature);
}