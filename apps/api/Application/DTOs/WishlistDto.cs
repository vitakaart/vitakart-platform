// File: apps/api/Application/DTOs/WishlistDto.cs
// All wishlist-related DTOs

namespace api.Application.DTOs;

// ==========================================
// USER SENDS THIS
// ==========================================

// Add/Toggle product in wishlist
public class WishlistActionDto
{
    public Guid ProductId { get; set; }
}

// ==========================================
// API RETURNS THESE
// ==========================================

// Wishlist item with product details
public class WishlistItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductSlug { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public string? Brand { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public decimal FinalPrice { get; set; }
    public int? DiscountPercentage { get; set; }
    public int StockQuantity { get; set; }
    public bool InStock { get; set; }
    public bool IsActive { get; set; }
    public DateTime AddedAt { get; set; }
}

// Toggle response
public class WishlistToggleDto
{
    public bool IsInWishlist { get; set; }
    public string Message { get; set; } = string.Empty;
    public int WishlistCount { get; set; }
}

// Simple response for count
public class WishlistCountDto
{
    public int Count { get; set; }
}