// File: apps/api/Application/Interfaces/ICouponUsageRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ICouponUsageRepository : IRepository<CouponUsage>
{
    // Get user's usage history for a coupon
    Task<int> GetUsageCountAsync(Guid userId, Guid couponId);
}