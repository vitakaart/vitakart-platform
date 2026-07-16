// File: apps/api/Infrastructure/Repositories/UnitOfWork.cs
// Unit of Work implementation — coordinates all repositories

using api.Application.Interfaces;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace api.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork, IDisposable
{
    private readonly AppDbContext _context;
    private readonly ITenantContext _tenantContext;
    private IDbContextTransaction? _transaction;

    // Lazy loaded repositories
    private ICategoryRepository? _categories;
    private IProductRepository? _products;
    private IUserRepository? _users;
    private IRefreshTokenRepository? _refreshTokens;
    private ITenantRepository? _tenants;

    public UnitOfWork(AppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    // Lazy load repositories (created only when accessed)
    public ICategoryRepository Categories =>
        _categories ??= new CategoryRepository(_context, _tenantContext);

    public IProductRepository Products =>
        _products ??= new ProductRepository(_context, _tenantContext);

    public IUserRepository Users =>
        _users ??= new UserRepository(_context, _tenantContext);

    public IRefreshTokenRepository RefreshTokens =>
        _refreshTokens ??= new RefreshTokenRepository(_context, _tenantContext);

    public ITenantRepository Tenants =>
        _tenants ??= new TenantRepository(_context, _tenantContext);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}