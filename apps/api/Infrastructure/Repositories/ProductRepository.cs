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

    // ==========================================
    // ATOMIC STOCK DEDUCTION (Race-condition safe)
    // ==========================================
    public async Task<bool> TryDeductStockAsync(Guid productId, int quantity)
    {
        // Atomic SQL UPDATE — thread-safe
        // Only deducts if enough stock available
        // Returns 0 if insufficient stock or product not found

        var affectedRows = await _context.Database.ExecuteSqlInterpolatedAsync(
            $@"UPDATE ""Products"" 
           SET ""StockQuantity"" = ""StockQuantity"" - {quantity}, 
               ""UpdatedAt"" = {DateTime.UtcNow}
           WHERE ""Id"" = {productId} 
             AND ""StockQuantity"" >= {quantity}
             AND ""IsDeleted"" = false"
        );

        return affectedRows > 0;
    }

    // ==========================================
    // ATOMIC STOCK RESTORATION (For cancellations)
    // ==========================================
    public async Task<bool> RestoreStockAsync(Guid productId, int quantity)
    {
        var affectedRows = await _context.Database.ExecuteSqlInterpolatedAsync(
            $@"UPDATE ""Products"" 
           SET ""StockQuantity"" = ""StockQuantity"" + {quantity}, 
               ""UpdatedAt"" = {DateTime.UtcNow}
           WHERE ""Id"" = {productId}
             AND ""IsDeleted"" = false"
        );

        return affectedRows > 0;
    }
    public IQueryable<Product> QueryWithCategory()
    {
        return Query().Include(p => p.Category);
    }
}