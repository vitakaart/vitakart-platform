// File: apps/api/Application/Interfaces/IRepository.cs
// Generic repository interface — common operations for all entities
// Multi-tenant aware, soft delete filtering built-in

using api.Domain.Common;
using System.Linq.Expressions;

namespace api.Application.Interfaces;

public interface IRepository<T> where T : BaseEntity
{
    // ==========================================
    // QUERIES (Read operations)
    // ==========================================

    // Get by ID (respects tenant + soft delete)
    Task<T?> GetByIdAsync(Guid id);

    // Get first matching entity
    Task<T?> GetFirstAsync(Expression<Func<T, bool>> predicate);

    // Get all entities
    Task<List<T>> GetAllAsync();

    // Get filtered list
    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate);

    // Check if entity exists
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

    // Count entities
    Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);

    // Get IQueryable for complex queries (with pagination, joins, etc.)
    IQueryable<T> Query();

    // Get IQueryable without tenant/soft delete filters (use carefully!)
    IQueryable<T> QueryUnfiltered();

    // ==========================================
    // COMMANDS (Write operations)
    // ==========================================

    // Add new entity (auto-sets TenantId, CreatedAt)
    Task<T> AddAsync(T entity);

    // Add multiple entities
    Task AddRangeAsync(IEnumerable<T> entities);

    // Update entity (auto-sets UpdatedAt)
    void Update(T entity);

    // Soft delete (sets IsDeleted = true)
    void SoftDelete(T entity);

    // Hard delete (removes from DB — use carefully!)
    void HardDelete(T entity);
}