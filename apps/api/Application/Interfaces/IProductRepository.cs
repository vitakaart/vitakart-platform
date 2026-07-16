// File: apps/api/Application/Interfaces/IProductRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetBySlugAsync(string slug);
    Task<Product?> GetByIdWithCategoryAsync(Guid id);
    Task<List<Product>> GetFeaturedAsync(int limit);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null);
    IQueryable<Product> QueryWithCategory();
}