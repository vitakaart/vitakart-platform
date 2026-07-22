// File: apps/api/Application/Services/WishlistService.cs
// Wishlist business logic with product validation

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class WishlistService : IWishlistService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    // Max wishlist items per user
    private const int MAX_WISHLIST_ITEMS = 100;

    public WishlistService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // ==========================================
    // GET USER WISHLIST
    // ==========================================
    public async Task<List<WishlistItemDto>> GetUserWishlistAsync(Guid userId)
    {
        var wishlistItems = await _unitOfWork.Wishlists.GetUserWishlistAsync(userId);

        return wishlistItems
            .Where(w => w.Product != null && !w.Product.IsDeleted)
            .Select(MapToDto)
            .ToList();
    }

    // ==========================================
    // TOGGLE WISHLIST (Smart add/remove)
    // ==========================================
    public async Task<WishlistToggleDto> ToggleWishlistAsync(Guid userId, Guid productId)
    {
        var existingItem = await _unitOfWork.Wishlists.GetWishlistItemAsync(userId, productId);

        // If exists → remove
        if (existingItem != null)
        {
            return await RemoveFromWishlistAsync(userId, productId);
        }

        // If not exists → add
        return await AddToWishlistAsync(userId, productId);
    }

    // ==========================================
    // ADD TO WISHLIST
    // ==========================================
    public async Task<WishlistToggleDto> AddToWishlistAsync(Guid userId, Guid productId)
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }

        // Check if product exists and is active
        var product = await _unitOfWork.Products.GetByIdAsync(productId);

        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        if (!product.IsActive)
        {
            throw new ValidationException("Product is not available");
        }

        // Check if already in wishlist (idempotent)
        var existingItem = await _unitOfWork.Wishlists.GetWishlistItemAsync(userId, productId);
        if (existingItem != null)
        {
            var count = await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);
            return new WishlistToggleDto
            {
                IsInWishlist = true,
                Message = "Product is already in your wishlist",
                WishlistCount = count
            };
        }

        // Check max limit
        var currentCount = await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);
        if (currentCount >= MAX_WISHLIST_ITEMS)
        {
            throw new ValidationException(
                $"Wishlist limit reached ({MAX_WISHLIST_ITEMS} items). Please remove some items.");
        }

        // Create wishlist item
        var wishlistItem = new Wishlist
        {
            TenantId = _tenantContext.TenantId!.Value,
            UserId = userId,
            ProductId = productId
        };

        await _unitOfWork.Wishlists.AddAsync(wishlistItem);
        await _unitOfWork.SaveChangesAsync();

        var newCount = await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);

        return new WishlistToggleDto
        {
            IsInWishlist = true,
            Message = "Added to wishlist",
            WishlistCount = newCount
        };
    }

    // ==========================================
    // REMOVE FROM WISHLIST
    // ==========================================
    public async Task<WishlistToggleDto> RemoveFromWishlistAsync(Guid userId, Guid productId)
    {
        var wishlistItem = await _unitOfWork.Wishlists.GetWishlistItemAsync(userId, productId);

        if (wishlistItem == null)
        {
            var count = await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);
            return new WishlistToggleDto
            {
                IsInWishlist = false,
                Message = "Product was not in wishlist",
                WishlistCount = count
            };
        }

        _unitOfWork.Wishlists.SoftDelete(wishlistItem);
        await _unitOfWork.SaveChangesAsync();

        var newCount = await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);

        return new WishlistToggleDto
        {
            IsInWishlist = false,
            Message = "Removed from wishlist",
            WishlistCount = newCount
        };
    }

    // ==========================================
    // CHECK IF IN WISHLIST
    // ==========================================
    public async Task<bool> IsInWishlistAsync(Guid userId, Guid productId)
    {
        return await _unitOfWork.Wishlists.IsInWishlistAsync(userId, productId);
    }

    // ==========================================
    // GET COUNT
    // ==========================================
    public async Task<int> GetWishlistCountAsync(Guid userId)
    {
        return await _unitOfWork.Wishlists.GetWishlistCountAsync(userId);
    }

    // ==========================================
    // GET ALL PRODUCT IDs (bulk check for UI)
    // ==========================================
    public async Task<List<Guid>> GetWishlistProductIdsAsync(Guid userId)
    {
        return await _unitOfWork.Wishlists.GetWishlistProductIdsAsync(userId);
    }

    // ==========================================
    // CLEAR WISHLIST
    // ==========================================
    public async Task ClearWishlistAsync(Guid userId)
    {
        var items = await _unitOfWork.Wishlists.GetUserWishlistAsync(userId);

        foreach (var item in items)
        {
            _unitOfWork.Wishlists.SoftDelete(item);
        }

        await _unitOfWork.SaveChangesAsync();
    }

    // ==========================================
    // PRIVATE HELPER
    // ==========================================
    private static WishlistItemDto MapToDto(Wishlist wishlist)
    {
        var product = wishlist.Product;
        var finalPrice = product.DiscountPrice ?? product.Price;
        var discountPercentage = product.DiscountPrice.HasValue && product.Price > 0
            ? (int)Math.Round(((product.Price - product.DiscountPrice.Value) / product.Price) * 100)
            : (int?)null;

        return new WishlistItemDto
        {
            Id = wishlist.Id,
            ProductId = product.Id,
            ProductName = product.Name,
            ProductSlug = product.Slug,
            ProductImage = product.ImageUrl,
            Brand = product.Brand,
            CategoryName = product.Category?.Name ?? string.Empty,
            CategorySlug = product.Category?.Slug ?? string.Empty,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            FinalPrice = finalPrice,
            DiscountPercentage = discountPercentage,
            StockQuantity = product.StockQuantity,
            InStock = product.StockQuantity > 0,
            IsActive = product.IsActive,
            AddedAt = wishlist.CreatedAt
        };
    }
}