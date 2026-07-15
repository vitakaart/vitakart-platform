// File: apps/api/Application/Services/CategoryService.cs
// Full category CRUD with multi-tenant support

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    private readonly ITenantContext _tenantContext;

    public CategoryService(AppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    // Get all categories (flat list, sorted)
    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var tenantId = GetTenantId();

        var categories = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto).ToList();
    }

    // Get top-level categories (no parent)
    public async Task<List<CategoryDto>> GetTopLevelAsync()
    {
        var tenantId = GetTenantId();

        var categories = await _context.Categories
            .Include(c => c.SubCategories)
            .Where(c => c.TenantId == tenantId 
                     && !c.IsDeleted 
                     && c.ParentCategoryId == null)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto).ToList();
    }

    // Get sub-categories of a parent
    public async Task<List<CategoryDto>> GetSubCategoriesAsync(Guid parentId)
    {
        var tenantId = GetTenantId();

        var categories = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .Where(c => c.TenantId == tenantId 
                     && !c.IsDeleted 
                     && c.ParentCategoryId == parentId)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto).ToList();
    }

    // Get full category tree (recursive)
    public async Task<List<CategoryTreeDto>> GetTreeAsync()
    {
        var tenantId = GetTenantId();

        // Load all categories at once
        var allCategories = await _context.Categories
            .Where(c => c.TenantId == tenantId && !c.IsDeleted)
            .OrderBy(c => c.SortOrder)
            .ThenBy(c => c.Name)
            .ToListAsync();

        // Build tree from top-level
        var topLevel = allCategories.Where(c => c.ParentCategoryId == null);

        return topLevel.Select(c => BuildTree(c, allCategories)).ToList();
    }

    // Get category by ID
    public async Task<CategoryDto> GetByIdAsync(Guid id)
    {
        var tenantId = GetTenantId();

        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id 
                                   && c.TenantId == tenantId 
                                   && !c.IsDeleted);

        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        return MapToDto(category);
    }

    // Get category by slug
    public async Task<CategoryDto> GetBySlugAsync(string slug)
    {
        var tenantId = GetTenantId();

        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Slug == slug 
                                   && c.TenantId == tenantId 
                                   && !c.IsDeleted);

        if (category == null)
        {
            throw new NotFoundException($"Category with slug '{slug}' not found");
        }

        return MapToDto(category);
    }

    // Create new category
    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var tenantId = GetTenantId();

        // Check slug uniqueness within tenant
        var slugExists = await _context.Categories
            .AnyAsync(c => c.Slug == dto.Slug 
                        && c.TenantId == tenantId 
                        && !c.IsDeleted);

        if (slugExists)
        {
            throw new ValidationException($"Category with slug '{dto.Slug}' already exists");
        }

        // Validate parent category if provided
        if (dto.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.ParentCategoryId.Value 
                            && c.TenantId == tenantId 
                            && !c.IsDeleted);

            if (!parentExists)
            {
                throw new ValidationException("Parent category not found");
            }
        }

        var category = new Category
        {
            TenantId = tenantId,
            ParentCategoryId = dto.ParentCategoryId,
            Name = dto.Name,
            Slug = dto.Slug,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            MetaTitle = dto.MetaTitle,
            MetaDescription = dto.MetaDescription
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        // Reload with navigation properties
        return await GetByIdAsync(category.Id);
    }

    // Update category
    public async Task<CategoryDto> UpdateAsync(Guid id, UpdateCategoryDto dto)
    {
        var tenantId = GetTenantId();

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id 
                                   && c.TenantId == tenantId 
                                   && !c.IsDeleted);

        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        // Check slug uniqueness (exclude current category)
        var slugExists = await _context.Categories
            .AnyAsync(c => c.Slug == dto.Slug 
                        && c.TenantId == tenantId 
                        && c.Id != id 
                        && !c.IsDeleted);

        if (slugExists)
        {
            throw new ValidationException($"Category with slug '{dto.Slug}' already exists");
        }

        // Validate parent (can't be self)
        if (dto.ParentCategoryId.HasValue)
        {
            if (dto.ParentCategoryId.Value == id)
            {
                throw new ValidationException("Category cannot be its own parent");
            }

            var parentExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.ParentCategoryId.Value 
                            && c.TenantId == tenantId 
                            && !c.IsDeleted);

            if (!parentExists)
            {
                throw new ValidationException("Parent category not found");
            }
        }

        // Update fields
        category.Name = dto.Name;
        category.Slug = dto.Slug;
        category.Description = dto.Description;
        category.ImageUrl = dto.ImageUrl;
        category.SortOrder = dto.SortOrder;
        category.IsActive = dto.IsActive;
        category.ParentCategoryId = dto.ParentCategoryId;
        category.MetaTitle = dto.MetaTitle;
        category.MetaDescription = dto.MetaDescription;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(category.Id);
    }

    // Delete category (soft delete)
    public async Task DeleteAsync(Guid id)
    {
        var tenantId = GetTenantId();

        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id 
                                   && c.TenantId == tenantId 
                                   && !c.IsDeleted);

        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        // Check if has active sub-categories
        var hasSubCategories = category.SubCategories.Any(sc => !sc.IsDeleted);
        if (hasSubCategories)
        {
            throw new ValidationException("Cannot delete category with sub-categories. Delete sub-categories first.");
        }

        // Soft delete
        category.IsDeleted = true;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private Guid GetTenantId()
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }
        return _tenantContext.TenantId!.Value;
    }

    private CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = category.ParentCategory?.Name,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            SortOrder = category.SortOrder,
            IsActive = category.IsActive,
            MetaTitle = category.MetaTitle,
            MetaDescription = category.MetaDescription,
            SubCategoriesCount = category.SubCategories?.Count(sc => !sc.IsDeleted) ?? 0,
            CreatedAt = category.CreatedAt,
            UpdatedAt = category.UpdatedAt
        };
    }

    private CategoryTreeDto BuildTree(Category category, List<Category> allCategories)
    {
        var children = allCategories
            .Where(c => c.ParentCategoryId == category.Id)
            .Select(c => BuildTree(c, allCategories))
            .ToList();

        return new CategoryTreeDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            ImageUrl = category.ImageUrl,
            SortOrder = category.SortOrder,
            IsActive = category.IsActive,
            Children = children
        };
    }
}