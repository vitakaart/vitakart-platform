// File: apps/api/Domain/Entities/Product.cs
// Enhanced with stock, image, discount, SKU
// Future ready — variants & images will be separate entities later

using api.Domain.Common;

namespace api.Domain.Entities;

public class Product : BaseEntity, ITenantEntity
{
    // Which tenant owns this product
    public Guid TenantId { get; set; }

    // Which category this product belongs to
    public Guid CategoryId { get; set; }

    // Product name — e.g., "Whey Protein 1kg Chocolate"
    public string Name { get; set; } = string.Empty;

    // URL slug — e.g., "whey-protein-1kg-chocolate"
    public string Slug { get; set; } = string.Empty;

    // Stock keeping unit — unique product code
    public string? Sku { get; set; }

    // Full product description
    public string? Description { get; set; }

    // Short description for cards/listings
    public string? ShortDescription { get; set; }

    // Brand name — e.g., "MuscleBlaze"
    public string? Brand { get; set; }

    // Regular price
    public decimal Price { get; set; }

    // Discounted/sale price (optional)
    public decimal? DiscountPrice { get; set; }

    // Main product image URL
    public string? ImageUrl { get; set; }

    // Stock quantity
    public int StockQuantity { get; set; } = 0;

    // Is this a featured product?
    public bool IsFeatured { get; set; } = false;

    // Is product visible on site?
    public bool IsActive { get; set; } = true;

    // When was product published (for scheduling)
    public DateTime? PublishedAt { get; set; }

    // SEO fields
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }

    // Navigation property
    public Category Category { get; set; } = null!;
}