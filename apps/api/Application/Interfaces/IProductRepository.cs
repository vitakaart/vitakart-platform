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

    /// <summary>
    /// Atomically deducts stock. Returns true if successful, false if insufficient stock.
    /// Thread-safe: Uses SQL UPDATE with WHERE clause to prevent race conditions.
    /// </summary>
    Task<bool> TryDeductStockAsync(Guid productId, int quantity);

    /// <summary>
    /// Atomically restores stock (for cancellations/refunds).
    /// </summary>
    Task<bool> RestoreStockAsync(Guid productId, int quantity);
}