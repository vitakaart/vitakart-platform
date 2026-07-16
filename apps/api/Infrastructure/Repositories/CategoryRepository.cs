// File: apps/api/Infrastructure/Repositories/CategoryRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        return await Query()
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task<List<Category>> GetTopLevelAsync()
    {
        return await Query()
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == null)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<List<Category>> GetSubCategoriesAsync(Guid parentId)
    {
        return await Query()
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .Where(c => c.ParentCategoryId == parentId)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<List<Category>> GetAllWithRelationsAsync()
    {
        return await Query()
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdWithRelationsAsync(Guid id)
    {
        return await Query()
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> HasSubCategoriesAsync(Guid categoryId)
    {
        return await Query()
            .AnyAsync(c => c.ParentCategoryId == categoryId);
    }

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null)
    {
        var query = Query().Where(c => c.Slug == slug);
        
        if (excludeId.HasValue)
        {
            query = query.Where(c => c.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }
}