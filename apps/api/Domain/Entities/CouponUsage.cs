// File: apps/api/Domain/Entities/CouponUsage.cs
// Track individual coupon usage per user

using api.Domain.Common;

namespace api.Domain.Entities;

public class CouponUsage : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }
    public Guid CouponId { get; set; }
    public Guid UserId { get; set; }
    public Guid OrderId { get; set; }

    // Discount amount applied
    public decimal DiscountAmount { get; set; }

    // Navigation
    public Coupon Coupon { get; set; } = null!;
    public User User { get; set; } = null!;
    public Order Order { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;  // ← ADD
}