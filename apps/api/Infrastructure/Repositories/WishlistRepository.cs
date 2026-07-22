// File: apps/api/Infrastructure/Repositories/WishlistRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class WishlistRepository : Repository<Wishlist>, IWishlistRepository
{
    public WishlistRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Get user's wishlist with product details (newest first)
    public async Task<List<Wishlist>> GetUserWishlistAsync(Guid userId)
    {
        return await Query()
            .Include(w => w.Product)
                .ThenInclude(p => p.Category)
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .ToListAsync();
    }

    // Check if product exists in wishlist
    public async Task<bool> IsInWishlistAsync(Guid userId, Guid productId)
    {
        return await Query()
            .AnyAsync(w => w.UserId == userId && w.ProductId == productId);
    }

    // Get specific wishlist item (for delete)
    public async Task<Wishlist?> GetWishlistItemAsync(Guid userId, Guid productId)
    {
        return await Query()
            .FirstOrDefaultAsync(w => w.UserId == userId && w.ProductId == productId);
    }

    // Count wishlist items
    public async Task<int> GetWishlistCountAsync(Guid userId)
    {
        return await Query()
            .CountAsync(w => w.UserId == userId);
    }

    // Get all product IDs (lightweight, for checking product list)
    public async Task<List<Guid>> GetWishlistProductIdsAsync(Guid userId)
    {
        return await Query()
            .Where(w => w.UserId == userId)
            .Select(w => w.ProductId)
            .ToListAsync();
    }
}