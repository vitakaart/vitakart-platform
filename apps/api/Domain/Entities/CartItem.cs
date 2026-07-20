// File: apps/api/Domain/Entities/CartItem.cs
// Cart item — one product in a cart

using api.Domain.Common;

namespace api.Domain.Entities;

public class CartItem : BaseEntity, ITenantEntity
{
    // Multi-tenant support
    public Guid TenantId { get; set; }

    // Which cart this item belongs to
    public Guid CartId { get; set; }

    // Which product
    public Guid ProductId { get; set; }

    // Quantity in cart
    public int Quantity { get; set; }

    // Price at the time of adding (snapshot)
    // If product price changes later, cart price stays
    public decimal UnitPrice { get; set; }

    // Discount price if any (snapshot)
    public decimal? DiscountPrice { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public Product Product { get; set; } = null!;

    // Calculated
    public decimal EffectivePrice => DiscountPrice ?? UnitPrice;
    public decimal TotalPrice => EffectivePrice * Quantity;
    public decimal SavedAmount => DiscountPrice.HasValue 
        ? (UnitPrice - DiscountPrice.Value) * Quantity 
        : 0;
}