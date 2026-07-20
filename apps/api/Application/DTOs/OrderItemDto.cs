// File: apps/api/Application/DTOs/Order/OrderItemDto.cs

namespace api.Application.DTOs.Order;

public class OrderItemDto
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public string? ProductBrand { get; set; }
    public string? ProductSku { get; set; }

    public int Quantity { get; set; }

    public decimal UnitPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public decimal EffectivePrice { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal SavedAmount { get; set; }
}