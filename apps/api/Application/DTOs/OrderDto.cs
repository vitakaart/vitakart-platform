// File: apps/api/Application/DTOs/Order/OrderDto.cs

using api.Domain.Enums;

namespace api.Application.DTOs.Order;

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;

    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }

    public decimal Subtotal { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal CouponDiscount { get; set; }
    public decimal Total { get; set; }

    public string? CouponCode { get; set; }

    // Shipping snapshot
    public string ShippingFullName { get; set; } = string.Empty;
    public string ShippingPhone { get; set; } = string.Empty;
    public string ShippingAddressLine1 { get; set; } = string.Empty;
    public string? ShippingAddressLine2 { get; set; }
    public string? ShippingLandmark { get; set; }
    public string ShippingCity { get; set; } = string.Empty;
    public string ShippingState { get; set; } = string.Empty;
    public string ShippingPincode { get; set; } = string.Empty;
    public string ShippingCountry { get; set; } = string.Empty;

    public string? CustomerNotes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}