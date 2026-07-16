// File: apps/api/Application/Services/CategoryService.cs
// Rewritten to use IUnitOfWork

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    public CategoryService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // Get all categories
    public async Task<List<CategoryDto>> GetAllAsync()
    {
        ValidateTenant();

        var categories = await _unitOfWork.Categories.GetAllWithRelationsAsync();
        return categories.Select(MapToDto).ToList();
    }

    // Get top-level categories
    public async Task<List<CategoryDto>> GetTopLevelAsync()
    {
        ValidateTenant();

        var categories = await _unitOfWork.Categories.GetTopLevelAsync();
        return categories.Select(MapToDto).ToList();
    }

    // Get sub-categories
    public async Task<List<CategoryDto>> GetSubCategoriesAsync(Guid parentId)
    {
        ValidateTenant();

        var categories = await _unitOfWork.Categories.GetSubCategoriesAsync(parentId);
        return categories.Select(MapToDto).ToList();
    }

    // Get tree structure
    public async Task<List<CategoryTreeDto>> GetTreeAsync()
    {
        ValidateTenant();

        var allCategories = await _unitOfWork.Categories.GetAllAsync();
        var topLevel = allCategories.Where(c => c.ParentCategoryId == null);

        return topLevel.Select(c => BuildTree(c, allCategories)).ToList();
    }

    // Get by ID
    public async Task<CategoryDto> GetByIdAsync(Guid id)
    {
        ValidateTenant();

        var category = await _unitOfWork.Categories.GetByIdWithRelationsAsync(id);
        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        return MapToDto(category);
    }

    // Get by slug
    public async Task<CategoryDto> GetBySlugAsync(string slug)
    {
        ValidateTenant();

        var category = await _unitOfWork.Categories.GetBySlugAsync(slug);
        if (category == null)
        {
            throw new NotFoundException($"Category with slug '{slug}' not found");
        }

        return MapToDto(category);
    }

    // Create
    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        ValidateTenant();

        // Check slug uniqueness
        var slugExists = await _unitOfWork.Categories.SlugExistsAsync(dto.Slug);
        if (slugExists)
        {
            throw new ValidationException($"Category with slug '{dto.Slug}' already exists");
        }

        // Validate parent
        if (dto.ParentCategoryId.HasValue)
        {
            var parentExists = await _unitOfWork.Categories
                .ExistsAsync(c => c.Id == dto.ParentCategoryId.Value);

            if (!parentExists)
            {
                throw new ValidationException("Parent category not found");
            }
        }

        var category = new Category
        {
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

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(category.Id);
    }

    // Update
    public async Task<CategoryDto> UpdateAsync(Guid id, UpdateCategoryDto dto)
    {
        ValidateTenant();

        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        // Check slug uniqueness
        var slugExists = await _unitOfWork.Categories.SlugExistsAsync(dto.Slug, id);
        if (slugExists)
        {
            throw new ValidationException($"Category with slug '{dto.Slug}' already exists");
        }

        // Validate parent
        if (dto.ParentCategoryId.HasValue)
        {
            if (dto.ParentCategoryId.Value == id)
            {
                throw new ValidationException("Category cannot be its own parent");
            }

            var parentExists = await _unitOfWork.Categories
                .ExistsAsync(c => c.Id == dto.ParentCategoryId.Value);

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

        _unitOfWork.Categories.Update(category);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(category.Id);
    }

    // Delete
    public async Task DeleteAsync(Guid id)
    {
        ValidateTenant();

        var category = await _unitOfWork.Categories.GetByIdAsync(id);
        if (category == null)
        {
            throw new NotFoundException("Category not found");
        }

        // Check sub-categories
        var hasSubCategories = await _unitOfWork.Categories.HasSubCategoriesAsync(id);
        if (hasSubCategories)
        {
            throw new ValidationException("Cannot delete category with sub-categories. Delete sub-categories first.");
        }

        _unitOfWork.Categories.SoftDelete(category);
        await _unitOfWork.SaveChangesAsync();
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private void ValidateTenant()
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }
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