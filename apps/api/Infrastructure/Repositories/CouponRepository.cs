// File: apps/api/Infrastructure/Repositories/CouponRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class CouponRepository : Repository<Coupon>, ICouponRepository
{
    public CouponRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Case-insensitive code lookup
    public async Task<Coupon?> GetByCodeAsync(string code)
    {
        if (string.IsNullOrWhiteSpace(code)) return null;

        var normalized = code.Trim().ToUpper();

        return await Query()
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == normalized);
    }

    // Count user's total usage of a specific coupon
    public async Task<int> GetUserUsageCountAsync(Guid userId, Guid couponId)
    {
        return await _context.CouponUsages
            .Where(u => !u.IsDeleted)
            .CountAsync(u => u.UserId == userId && u.CouponId == couponId);
    }

    // Get all active coupons
    public async Task<List<Coupon>> GetActiveCouponsAsync()
    {
        var now = DateTime.UtcNow;

        return await Query()
            .Where(c => c.IsActive)
            .Where(c => !c.ValidFrom.HasValue || c.ValidFrom.Value <= now)
            .Where(c => !c.ValidUntil.HasValue || c.ValidUntil.Value >= now)
            .Where(c => !c.UsageLimit.HasValue || c.UsageCount < c.UsageLimit.Value)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }
}