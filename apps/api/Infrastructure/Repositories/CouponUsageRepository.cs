// File: apps/api/Infrastructure/Repositories/CouponUsageRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class CouponUsageRepository : Repository<CouponUsage>, ICouponUsageRepository
{
    public CouponUsageRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    public async Task<int> GetUsageCountAsync(Guid userId, Guid couponId)
    {
        return await Query()
            .CountAsync(u => u.UserId == userId && u.CouponId == couponId);
    }
}