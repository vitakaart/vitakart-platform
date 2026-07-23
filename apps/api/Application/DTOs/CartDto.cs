// File: apps/api/Application/DTOs/CartDto.cs
// Cart related DTOs

namespace api.Application.DTOs;

// Full cart response
public class CartDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? CouponCode { get; set; }
    public decimal CouponDiscount { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public int TotalItems { get; set; }
    public int UniqueItemsCount { get; set; }
    public decimal Subtotal { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// Individual cart item
public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public string? Brand { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public decimal EffectivePrice { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal SavedAmount { get; set; }
    public int AvailableStock { get; set; }
    public bool InStock { get; set; }
}

// Add item to cart
public class AddToCartDto
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; } = 1;
}

// Update quantity
public class UpdateCartItemDto
{
    public int Quantity { get; set; }
}

