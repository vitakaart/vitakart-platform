// File: apps/api/Application/Interfaces/ICouponService.cs

using api.Application.DTOs;
using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ICouponService
{
    // Validate coupon and calculate discount
    Task<CouponValidationDto> ValidateCouponAsync(
        string code,
        Guid userId,
        decimal cartSubtotal);

    // Apply coupon to user's cart
    Task<CartDto> ApplyCouponToCartAsync(Guid userId, string code);

    // Remove coupon from cart
    Task<CartDto> RemoveCouponFromCartAsync(Guid userId);

    // Get all active public coupons
    Task<List<CouponDto>> GetActiveCouponsAsync(Guid? userId = null);

    // Get single coupon by code (public info)
    Task<CouponDto?> GetCouponInfoAsync(string code);

    // Calculate discount for given amount
    decimal CalculateDiscount(Coupon coupon, decimal subtotal);
}