// File: apps/api/Infrastructure/Repositories/UserRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await Query().FirstOrDefaultAsync(u => u.Email == email);
    }

    // For scenarios where tenant is explicitly needed (unfiltered)
    public async Task<User?> GetByEmailAndTenantAsync(string email, Guid tenantId)
    {
        return await QueryUnfiltered()
            .Where(u => !u.IsDeleted)
            .FirstOrDefaultAsync(u => u.Email == email && u.TenantId == tenantId);
    }

    public async Task<bool> EmailExistsAsync(string email, Guid tenantId)
    {
        return await QueryUnfiltered()
            .Where(u => !u.IsDeleted)
            .AnyAsync(u => u.Email == email && u.TenantId == tenantId);
    }
}