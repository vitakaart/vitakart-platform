// File: apps/api/Application/Interfaces/ICategoryRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    // Category-specific methods
    Task<Category?> GetBySlugAsync(string slug);
    Task<List<Category>> GetTopLevelAsync();
    Task<List<Category>> GetSubCategoriesAsync(Guid parentId);
    Task<List<Category>> GetAllWithRelationsAsync();
    Task<Category?> GetByIdWithRelationsAsync(Guid id);
    Task<bool> HasSubCategoriesAsync(Guid categoryId);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null);
}