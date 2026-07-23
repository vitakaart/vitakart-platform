// File: apps/api/Application/Interfaces/ICouponRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ICouponRepository : IRepository<Coupon>
{
    // Get coupon by code (case-insensitive)
    Task<Coupon?> GetByCodeAsync(string code);

    // Count how many times user has used this coupon
    Task<int> GetUserUsageCountAsync(Guid userId, Guid couponId);

    // Get all active coupons (for display)
    Task<List<Coupon>> GetActiveCouponsAsync();
}