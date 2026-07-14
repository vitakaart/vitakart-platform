// File: apps/api/Domain/Entities/Product.cs
// Main product table
// Products belong to a category and a tenant
// Actual price and stock lives in ProductVariant (we'll add later)

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

    // Full product description
    public string? Description { get; set; }

    // Short description for cards/listings
    public string? ShortDescription { get; set; }

    // Brand name — e.g., "MuscleBlaze"
    public string? Brand { get; set; }

    // Base price (variants can have different prices)
    public decimal Price { get; set; }

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
}