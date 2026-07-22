// File: apps/api/Application/Interfaces/IWishlistRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IWishlistRepository : IRepository<Wishlist>
{
    // Get user's wishlist with products
    Task<List<Wishlist>> GetUserWishlistAsync(Guid userId);

    // Check if product is in user's wishlist
    Task<bool> IsInWishlistAsync(Guid userId, Guid productId);

    // Get single wishlist item
    Task<Wishlist?> GetWishlistItemAsync(Guid userId, Guid productId);

    // Count user's wishlist items
    Task<int> GetWishlistCountAsync(Guid userId);

    // Get all product IDs in user's wishlist (for bulk check)
    Task<List<Guid>> GetWishlistProductIdsAsync(Guid userId);
}