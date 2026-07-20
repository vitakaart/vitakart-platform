// File: apps/api/Domain/Enums/PaymentStatus.cs
// Payment lifecycle states

namespace api.Domain.Enums;

public enum PaymentStatus
{
    // Payment not yet received
    Pending = 0,

    // Payment successful
    Paid = 1,

    // Payment attempt failed
    Failed = 2,

    // Payment refunded to customer
    Refunded = 3,

    // Partial refund processed
    PartiallyRefunded = 4
}