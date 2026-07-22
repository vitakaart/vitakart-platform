// File: apps/api/Infrastructure/Repositories/AddressRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class AddressRepository : Repository<Address>, IAddressRepository
{
    public AddressRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Get all addresses — default first, then newest
    public async Task<List<Address>> GetUserAddressesAsync(Guid userId)
    {
        return await Query()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.IsDefault)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    // Get single address (with user check for security)
    public async Task<Address?> GetUserAddressAsync(Guid userId, Guid addressId)
    {
        return await Query()
            .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);
    }

    // Get default address
    public async Task<Address?> GetDefaultAddressAsync(Guid userId)
    {
        return await Query()
            .FirstOrDefaultAsync(a => a.UserId == userId && a.IsDefault);
    }

    // Count user addresses
    public async Task<int> GetAddressCountAsync(Guid userId)
    {
        return await Query()
            .CountAsync(a => a.UserId == userId);
    }

    // Clear default flag from ALL user's addresses
    // Used when setting a new default
    public async Task ClearDefaultAsync(Guid userId)
    {
        var defaults = await Query()
            .Where(a => a.UserId == userId && a.IsDefault)
            .ToListAsync();

        foreach (var addr in defaults)
        {
            addr.IsDefault = false;
            addr.UpdatedAt = DateTime.UtcNow;
        }
    }
}