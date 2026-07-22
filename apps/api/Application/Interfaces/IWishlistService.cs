// File: apps/api/Application/Interfaces/IWishlistService.cs

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IWishlistService
{
    // Get all wishlist items for user
    Task<List<WishlistItemDto>> GetUserWishlistAsync(Guid userId);

    // Toggle product (add if not exists, remove if exists)
    Task<WishlistToggleDto> ToggleWishlistAsync(Guid userId, Guid productId);

    // Add product to wishlist
    Task<WishlistToggleDto> AddToWishlistAsync(Guid userId, Guid productId);

    // Remove product from wishlist
    Task<WishlistToggleDto> RemoveFromWishlistAsync(Guid userId, Guid productId);

    // Check if product is in wishlist
    Task<bool> IsInWishlistAsync(Guid userId, Guid productId);

    // Get count
    Task<int> GetWishlistCountAsync(Guid userId);

    // Get all wishlisted product IDs (bulk check)
    Task<List<Guid>> GetWishlistProductIdsAsync(Guid userId);

    // Clear all wishlist items
    Task ClearWishlistAsync(Guid userId);
}