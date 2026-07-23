// File: apps/api/Application/DTOs/CouponDto.cs
// All coupon-related DTOs

namespace api.Application.DTOs;

// ==========================================
// USER SENDS THESE
// ==========================================

// Apply coupon to cart
public class ApplyCouponDto
{
    public string Code { get; set; } = string.Empty;
}

// Admin creates coupon (future - for admin panel)
public class CreateCouponDto
{
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "Percentage";  // Percentage / Fixed
    public decimal Value { get; set; }
    public decimal? MaxDiscount { get; set; }
    public decimal MinOrderAmount { get; set; } = 0;
    public int? UsageLimit { get; set; }
    public int? PerUserLimit { get; set; } = 1;
    public DateTime? ValidFrom { get; set; }
    public DateTime? ValidUntil { get; set; }
    public bool IsActive { get; set; } = true;

}

// ==========================================
// API RETURNS THESE
// ==========================================

// Public coupon display (for list)
public class CouponDto
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal? MaxDiscount { get; set; }
    public decimal MinOrderAmount { get; set; }
    public DateTime? ValidUntil { get; set; }
    public string DisplayText { get; set; } = string.Empty;    // "10% OFF up to ₹100"
    public string ConditionText { get; set; } = string.Empty;  // "Min order ₹500"

    // User usage info
    public int UserUsageCount { get; set; }
    public int? PerUserLimit { get; set; }
    public bool IsUsedByUser { get; set; }
    public bool CanUseAgain { get; set; } = true;
}

// Coupon validation result
public class CouponValidationDto
{
    public bool IsValid { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal DiscountAmount { get; set; }
    public CouponDto? Coupon { get; set; }
}