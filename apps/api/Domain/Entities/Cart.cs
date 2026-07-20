// File: apps/api/Domain/Entities/Cart.cs
// Cart entity — one per user, contains multiple items

using api.Domain.Common;

namespace api.Domain.Entities;

public class Cart : BaseEntity, ITenantEntity
{
    // Multi-tenant support
    public Guid TenantId { get; set; }

    // User who owns this cart
    public Guid UserId { get; set; }

    // Optional coupon code applied
    public string? CouponCode { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
    public ICollection<CartItem> Items { get; set; } = new List<CartItem>();

    // Calculated properties (not stored in DB)
    public decimal Subtotal => Items?.Sum(i => i.TotalPrice) ?? 0;
    public int TotalItems => Items?.Sum(i => i.Quantity) ?? 0;
    public int UniqueItemsCount => Items?.Count ?? 0;
}