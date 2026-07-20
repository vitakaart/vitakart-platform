// File: apps/api/Domain/Entities/Order.cs
// Order entity — snapshots shipping address & payment info
// Everything captured at order time (immutable snapshot)

using api.Domain.Common;
using api.Domain.Enums;

namespace api.Domain.Entities;

public class Order : BaseEntity, ITenantEntity
{
    // ==========================================
    // TENANT & USER
    // ==========================================

    // Which tenant this order belongs to
    public Guid TenantId { get; set; }

    // Customer who placed the order
    public Guid UserId { get; set; }

    // Human-readable unique order number (e.g., "ORD-2025-000001")
    public string OrderNumber { get; set; } = string.Empty;

    // ==========================================
    // STATUS
    // ==========================================

    // Current order status
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    // Current payment status
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    // Payment method chosen
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.COD;

    // ==========================================
    // PRICING (all amounts in ₹)
    // ==========================================

    // Sum of all items (before discount, shipping)
    public decimal Subtotal { get; set; }

    // Total discount applied (from product discounts + coupons)
    public decimal TotalDiscount { get; set; }

    // Shipping fee (0 if free shipping)
    public decimal ShippingFee { get; set; }

    // Tax amount (GST etc.) — for future use
    public decimal TaxAmount { get; set; }

    // Final amount customer paid/will pay
    public decimal Total { get; set; }

    // Coupon code used (if any)
    public string? CouponCode { get; set; }

    // Coupon discount amount
    public decimal CouponDiscount { get; set; }

    // ==========================================
    // SHIPPING ADDRESS (SNAPSHOT)
    // Address stored at order time — won't change if user updates profile
    // ==========================================

    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string? ShippingLandmark { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingState { get; set; } = string.Empty;
    public string ShippingPincode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = "India";

    // ==========================================
    // PAYMENT INFO (for online payments)
    // ==========================================

    // Payment gateway transaction ID (Razorpay payment_id)
    public string? PaymentTransactionId { get; set; }

    // Payment gateway order ID (Razorpay order_id)
    public string? PaymentGatewayOrderId { get; set; }

    // Payment signature (for verification)
    public string? PaymentSignature { get; set; }

    // When payment was completed
    public DateTime? PaidAt { get; set; }

    // ==========================================
    // CUSTOMER NOTES
    // ==========================================

    // Customer's note (delivery instructions etc.)
    public string? CustomerNotes { get; set; }

    // ==========================================
    // CANCELLATION
    // ==========================================

    // Reason for cancellation
    public string? CancellationReason { get; set; }

    // Who cancelled (Customer / Admin / System)
    public string? CancelledBy { get; set; }

    // When cancelled
    public DateTime? CancelledAt { get; set; }

    // ==========================================
    // TIMESTAMPS (order lifecycle tracking)
    // ==========================================

    // When order was confirmed
    public DateTime? ConfirmedAt { get; set; }

    // When processing started
    public DateTime? ProcessingAt { get; set; }

    // When shipped
    public DateTime? ShippedAt { get; set; }

    // When delivered
    public DateTime? DeliveredAt { get; set; }

    // Expected delivery date
    public DateTime? ExpectedDeliveryDate { get; set; }

    // ==========================================
    // SHIPPING/TRACKING (optional, for future)
    // ==========================================

    // Tracking number from courier
    public string? TrackingNumber { get; set; }

    // Courier partner name
    public string? CourierPartner { get; set; }

    // ==========================================
    // IDEMPOTENCY (prevent duplicate orders)
    // ==========================================

    // Unique key to prevent double-clicks creating multiple orders
    public string? IdempotencyKey { get; set; }

    // ==========================================
    // NAVIGATION PROPERTIES
    // ==========================================

    // Order items (products in this order)
    public List<OrderItem> Items { get; set; } = new();

    // Customer info
    public User User { get; set; } = null!;

    // Tenant info
    public Tenant Tenant { get; set; } = null!;
}