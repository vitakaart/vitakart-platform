// File: apps/api/Infrastructure/Repositories/ProductRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    public async Task<Product?> GetBySlugAsync(string slug)
    {
        return await Query()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug);
    }

    public async Task<Product?> GetByIdWithCategoryAsync(Guid id)
    {
        return await Query()
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Product>> GetFeaturedAsync(int limit)
    {
        return await Query()
            .Include(p => p.Category)
            .Where(p => p.IsActive && p.IsFeatured)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null)
    {
        var query = Query().Where(p => p.Slug == slug);
        
        if (excludeId.HasValue)
        {
            query = query.Where(p => p.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }

    public IQueryable<Product> QueryWithCategory()
    {
        return Query().Include(p => p.Category);
    }
}