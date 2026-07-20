// File: apps/api/Domain/Entities/OrderItem.cs
// Order line item — SNAPSHOTS product data at order time
// If product name/price changes later, order remains unchanged

using api.Domain.Common;

namespace api.Domain.Entities;

public class OrderItem : BaseEntity, ITenantEntity
{
    // ==========================================
    // TENANT & RELATIONS
    // ==========================================

    // Tenant isolation
    public Guid TenantId { get; set; }

    // Which order this item belongs to
    public Guid OrderId { get; set; }

    // Product reference (kept for linking, but data is snapshotted)
    public Guid ProductId { get; set; }

    // ==========================================
    // PRODUCT SNAPSHOT (immutable data)
    // ==========================================

    // Product name at time of order
    public string ProductName { get; set; } = string.Empty;

    // Product slug (for linking to product page)
    public string ProductSlug { get; set; } = string.Empty;

    // Product image URL at time of order
    public string? ProductImage { get; set; }

    // Brand name at time of order
    public string? ProductBrand { get; set; }

    // SKU at time of order
    public string? ProductSku { get; set; }

    // ==========================================
    // PRICING SNAPSHOT
    // ==========================================

    // Regular price at time of order
    public decimal UnitPrice { get; set; }

    // Discount price at time of order (if any)
    public decimal? DiscountPrice { get; set; }

    // Effective price paid per unit (Discount price if available, else UnitPrice)
    public decimal EffectivePrice { get; set; }

    // Quantity ordered
    public int Quantity { get; set; }

    // Total for this line item (EffectivePrice × Quantity)
    public decimal TotalPrice { get; set; }

    // Amount saved on this item ((UnitPrice - EffectivePrice) × Quantity)
    public decimal SavedAmount { get; set; }

    // ==========================================
    // NAVIGATION PROPERTIES
    // ==========================================

    public Order Order { get; set; } = null!;

    // Product reference (nullable in case product is deleted)
    public Product? Product { get; set; }
}