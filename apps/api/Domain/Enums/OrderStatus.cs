// File: apps/api/Domain/Enums/OrderStatus.cs
// Order lifecycle states — from creation to delivery

namespace api.Domain.Enums;

public enum OrderStatus
{
    // Order created but not confirmed (payment pending for online, or initial state)
    Pending = 0,

    // Order confirmed (payment received for online, or COD accepted)
    Confirmed = 1,

    // Order is being prepared/packed
    Processing = 2,

    // Order shipped to customer
    Shipped = 3,

    // Order delivered successfully
    Delivered = 4,

    // Order cancelled (by user or admin)
    Cancelled = 5,

    // Order returned by customer
    Returned = 6,

    // Refund processed
    Refunded = 7
}