// File: apps/api/Domain/Entities/Coupon.cs
// Discount coupon entity

using api.Domain.Common;
using api.Domain.Enums;

namespace api.Domain.Entities;

public class Coupon : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }

    // ==========================================
    // BASIC INFO
    // ==========================================

    // Unique coupon code (e.g., "WELCOME10")
    public string Code { get; set; } = string.Empty;

    // Display description
    public string? Description { get; set; }

    // ==========================================
    // DISCOUNT
    // ==========================================

    // Percentage or Fixed amount
    public CouponType Type { get; set; } = CouponType.Percentage;

    // Discount value (10 = 10% OR ₹10 based on type)
    public decimal Value { get; set; }

    // Maximum discount cap (for percentage type)
    // e.g., 10% off, max ₹100
    public decimal? MaxDiscount { get; set; }

    // ==========================================
    // CONDITIONS
    // ==========================================

    // Minimum order amount to apply
    public decimal MinOrderAmount { get; set; } = 0;

    // ==========================================
    // USAGE LIMITS
    // ==========================================

    // Total times coupon can be used (null = unlimited)
    public int? UsageLimit { get; set; }

    // How many times used so far
    public int UsageCount { get; set; } = 0;

    // How many times a single user can use (null = unlimited)
    public int? PerUserLimit { get; set; } = 1;

    // ==========================================
    // VALIDITY
    // ==========================================

    // Start date (null = valid immediately)
    public DateTime? ValidFrom { get; set; }

    // Expiry date (null = never expires)
    public DateTime? ValidUntil { get; set; }

    // Is coupon active?
    public bool IsActive { get; set; } = true;

    // Navigation
    public Tenant Tenant { get; set; } = null!;

    // Helpers
    public bool IsExpired => ValidUntil.HasValue && ValidUntil.Value < DateTime.UtcNow;
    public bool IsNotStarted => ValidFrom.HasValue && ValidFrom.Value > DateTime.UtcNow;
    public bool HasReachedLimit => UsageLimit.HasValue && UsageCount >= UsageLimit.Value;
    public bool IsValid => IsActive && !IsExpired && !IsNotStarted && !HasReachedLimit;
}