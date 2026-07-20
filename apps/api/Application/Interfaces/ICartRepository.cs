// File: apps/api/Application/Interfaces/ICartRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    // Get user's cart with all items and product details
    Task<Cart?> GetUserCartAsync(Guid userId);

    // Get or create cart for user
    Task<Cart> GetOrCreateCartAsync(Guid userId);

    // Get specific cart item
    Task<CartItem?> GetCartItemAsync(Guid cartId, Guid productId);

    // Get cart item by ID with product
    Task<CartItem?> GetCartItemByIdAsync(Guid itemId);

    // Add cart item (NEW METHOD)
    Task AddCartItemAsync(CartItem item);

    // Update cart item (NEW METHOD)
    void UpdateCartItem(CartItem item);
}