// File: apps/api/Infrastructure/Repositories/Repository.cs
// Generic repository implementation with multi-tenant + soft delete magic

using api.Application.Interfaces;
using api.Domain.Common;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    protected readonly AppDbContext _context;
    protected readonly ITenantContext _tenantContext;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
        _dbSet = _context.Set<T>();
    }

    // ==========================================
    // QUERIES
    // ==========================================

    public virtual async Task<T?> GetByIdAsync(Guid id)
    {
        return await Query().FirstOrDefaultAsync(e => e.Id == id);
    }

    public virtual async Task<T?> GetFirstAsync(Expression<Func<T, bool>> predicate)
    {
        return await Query().FirstOrDefaultAsync(predicate);
    }

    public virtual async Task<List<T>> GetAllAsync()
    {
        return await Query().ToListAsync();
    }

    public virtual async Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await Query().Where(predicate).ToListAsync();
    }

    public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
    {
        return await Query().AnyAsync(predicate);
    }

    public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
    {
        return predicate == null
            ? await Query().CountAsync()
            : await Query().CountAsync(predicate);
    }

    // Main query — applies multi-tenant + soft delete filters automatically
    public virtual IQueryable<T> Query()
    {
        var query = _dbSet.AsQueryable();

        // Apply soft delete filter (IsDeleted = false)
        query = query.Where(e => !e.IsDeleted);

        // Apply tenant filter if entity is multi-tenant AND tenant is set
        if (typeof(ITenantEntity).IsAssignableFrom(typeof(T)) && _tenantContext.IsResolved)
        {
            var tenantId = _tenantContext.TenantId!.Value;
            query = query.Where(e => ((ITenantEntity)e).TenantId == tenantId);
        }

        return query;
    }

    // Unfiltered query (use for admin/system operations)
    public virtual IQueryable<T> QueryUnfiltered()
    {
        return _dbSet.AsQueryable();
    }

    // ==========================================
    // COMMANDS
    // ==========================================

    public virtual async Task<T> AddAsync(T entity)
    {
        // Auto-set TenantId if multi-tenant entity
        if (entity is ITenantEntity tenantEntity && _tenantContext.IsResolved)
        {
            if (tenantEntity.TenantId == Guid.Empty)
            {
                tenantEntity.TenantId = _tenantContext.TenantId!.Value;
            }
        }

        entity.CreatedAt = DateTime.UtcNow;

        await _dbSet.AddAsync(entity);
        return entity;
    }

    public virtual async Task AddRangeAsync(IEnumerable<T> entities)
    {
        var now = DateTime.UtcNow;
        foreach (var entity in entities)
        {
            if (entity is ITenantEntity tenantEntity && _tenantContext.IsResolved)
            {
                if (tenantEntity.TenantId == Guid.Empty)
                {
                    tenantEntity.TenantId = _tenantContext.TenantId!.Value;
                }
            }
            entity.CreatedAt = now;
        }

        await _dbSet.AddRangeAsync(entities);
    }

    public virtual void Update(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    public virtual void SoftDelete(T entity)
    {
        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow;
        _dbSet.Update(entity);
    }

    public virtual void HardDelete(T entity)
    {
        _dbSet.Remove(entity);
    }
}