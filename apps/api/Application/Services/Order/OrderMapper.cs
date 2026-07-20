// File: apps/api/Application/Services/Order/Helpers/OrderMapper.cs
// Maps Order entities to DTOs
// Single Responsibility: Data transformation

using api.Application.DTOs.Order;
using api.Domain.Entities;

namespace api.Application.Services.Order.Helpers;

public class OrderMapper
{
    // Map Order → OrderDto (full detail)
    public OrderDto ToDto(api.Domain.Entities.Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            PaymentMethod = order.PaymentMethod,

            Subtotal = order.Subtotal,
            TotalDiscount = order.TotalDiscount,
            ShippingFee = order.ShippingFee,
            TaxAmount = order.TaxAmount,
            CouponDiscount = order.CouponDiscount,
            Total = order.Total,
            CouponCode = order.CouponCode,

            ShippingFullName = order.ShippingFullName,
            ShippingPhone = order.ShippingPhone,
            ShippingAddressLine1 = order.ShippingAddressLine1,
            ShippingAddressLine2 = order.ShippingAddressLine2,
            ShippingLandmark = order.ShippingLandmark,
            ShippingCity = order.ShippingCity,
            ShippingState = order.ShippingState,
            ShippingPincode = order.ShippingPincode,
            ShippingCountry = order.ShippingCountry,

            CustomerNotes = order.CustomerNotes,

            CreatedAt = order.CreatedAt,
            ConfirmedAt = order.ConfirmedAt,
            ShippedAt = order.ShippedAt,
            DeliveredAt = order.DeliveredAt,
            CancelledAt = order.CancelledAt,

            Items = order.Items?
                .Where(i => !i.IsDeleted)
                .Select(ToItemDto)
                .ToList() ?? new List<OrderItemDto>(),
        };
    }

    // Map OrderItem → OrderItemDto
    public OrderItemDto ToItemDto(OrderItem item)
    {
        return new OrderItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.ProductName,
            ProductSlug = item.ProductSlug,
            ProductImage = item.ProductImage,
            ProductBrand = item.ProductBrand,
            ProductSku = item.ProductSku,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            DiscountPrice = item.DiscountPrice,
            EffectivePrice = item.EffectivePrice,
            TotalPrice = item.TotalPrice,
            SavedAmount = item.SavedAmount,
        };
    }

    // Map Order → OrderListDto (lightweight)
    public OrderListDto ToListDto(api.Domain.Entities.Order order)
    {
        return new OrderListDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            Total = order.Total,
            TotalItems = order.Items?
                .Where(i => !i.IsDeleted)
                .Sum(i => i.Quantity) ?? 0,
            CreatedAt = order.CreatedAt,
        };
    }
}