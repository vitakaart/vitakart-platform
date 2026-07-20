// File: apps/api/Infrastructure/Repositories/CartRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Get user's cart with items and products
    public async Task<Cart?> GetUserCartAsync(Guid userId)
    {
        return await Query()
            .Include(c => c.Items.Where(i => !i.IsDeleted))
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);
    }

    // Get or create cart (idempotent)
    public async Task<Cart> GetOrCreateCartAsync(Guid userId)
    {
        var cart = await GetUserCartAsync(userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
            };
            await AddAsync(cart);
            await _context.SaveChangesAsync();

            // Fetch again with includes
            cart = await GetUserCartAsync(userId);
        }

        return cart!;
    }

    // Get specific item in cart
    public async Task<CartItem?> GetCartItemAsync(Guid cartId, Guid productId)
    {
        return await _context.CartItems
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i =>
                i.CartId == cartId &&
                i.ProductId == productId &&
                !i.IsDeleted);
    }

    // Get cart item by ID
    public async Task<CartItem?> GetCartItemByIdAsync(Guid itemId)
    {
        return await _context.CartItems
            .Include(i => i.Product)
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == itemId && !i.IsDeleted);
    }

    // Add cart item (auto-sets TenantId)
    public async Task AddCartItemAsync(CartItem item)
    {
        // Auto-set TenantId
        if (_tenantContext.IsResolved && item.TenantId == Guid.Empty)
        {
            item.TenantId = _tenantContext.TenantId!.Value;
        }

        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.CartItems.AddAsync(item);
    }

    // Update cart item
    public void UpdateCartItem(CartItem item)
    {
        item.UpdatedAt = DateTime.UtcNow;
        _context.CartItems.Update(item);
    }
}