// File: apps/api/Application/Interfaces/IPaymentRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IPaymentRepository : IRepository<Payment>
{
    /// <summary>
    /// Get payment by Razorpay order ID
    /// </summary>
    Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId);

    /// <summary>
    /// Get all payments for an order
    /// </summary>
    Task<List<Payment>> GetByOrderIdAsync(Guid orderId);

    /// <summary>
    /// Get latest payment attempt for an order
    /// </summary>
    Task<Payment?> GetLatestByOrderIdAsync(Guid orderId);
}