// File: apps/api/Infrastructure/Repositories/TenantRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class TenantRepository : Repository<Tenant>, ITenantRepository
{
    public TenantRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Tenants are cross-tenant entities — use unfiltered
    public override IQueryable<Tenant> Query()
    {
        return QueryUnfiltered().Where(t => !t.IsDeleted);
    }

    public async Task<Tenant?> GetBySlugAsync(string slug)
    {
        return await Query()
            .FirstOrDefaultAsync(t => t.Slug == slug);
    }

    public async Task<bool> SlugExistsAsync(string slug)
    {
        return await Query().AnyAsync(t => t.Slug == slug);
    }
}