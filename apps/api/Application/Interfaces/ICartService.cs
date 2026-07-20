// File: apps/api/Application/Interfaces/ICartService.cs

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface ICartService
{
    // Get current user's cart
    Task<CartDto> GetCartAsync(Guid userId);

    // Add product to cart
    Task<CartDto> AddToCartAsync(Guid userId, AddToCartDto dto);

    // Update item quantity
    Task<CartDto> UpdateCartItemAsync(Guid userId, Guid itemId, UpdateCartItemDto dto);

    // Remove item from cart
    Task<CartDto> RemoveCartItemAsync(Guid userId, Guid itemId);

    // Clear all items
    Task<CartDto> ClearCartAsync(Guid userId);
}