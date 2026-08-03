// File: apps/api/Domain/Entities/Payment.cs
// Payment entity — tracks all payment attempts for orders

using api.Domain.Common;
using api.Domain.Enums;

namespace api.Domain.Entities;

public class Payment : BaseEntity, ITenantEntity
{
    // Multi-tenancy
    public Guid TenantId { get; set; }
    public Tenant Tenant { get; set; } = null!;

    // Order relationship
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    // User relationship
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    // Razorpay identifiers
    public string? RazorpayOrderId { get; set; }
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }

    // Payment details
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; }

    // Payment metadata
    public string PaymentGateway { get; set; } = "Razorpay";
    public string? FailureReason { get; set; }
    public string? ErrorCode { get; set; }

    // Timestamps
    public DateTime? PaidAt { get; set; }
    public DateTime? FailedAt { get; set; }
}