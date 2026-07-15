// File: apps/api/Application/Interfaces/ICategoryService.cs
// Contract for category operations

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface ICategoryService
{
    // Get all categories (flat list)
    Task<List<CategoryDto>> GetAllAsync();

    // Get top-level categories (no parent)
    Task<List<CategoryDto>> GetTopLevelAsync();

    // Get sub-categories of a parent
    Task<List<CategoryDto>> GetSubCategoriesAsync(Guid parentId);

    // Get full category tree
    Task<List<CategoryTreeDto>> GetTreeAsync();

    // Get category by ID
    Task<CategoryDto> GetByIdAsync(Guid id);

    // Get category by slug
    Task<CategoryDto> GetBySlugAsync(string slug);

    // Create new category
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);

    // Update category
    Task<CategoryDto> UpdateAsync(Guid id, UpdateCategoryDto dto);

    // Delete category (soft delete)
    Task DeleteAsync(Guid id);
}