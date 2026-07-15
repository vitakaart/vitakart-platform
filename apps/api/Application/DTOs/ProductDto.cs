// File: apps/api/Application/DTOs/ProductDto.cs
// All product related DTOs

namespace api.Application.DTOs;

// Create product
public class CreateProductDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; } = 0;
    public bool IsFeatured { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime? PublishedAt { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
}

// Update product
public class UpdateProductDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
}

// API response
public class ProductDto
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string CategorySlug { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Sku { get; set; }
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public string? Brand { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public decimal FinalPrice => DiscountPrice ?? Price;
    public decimal? DiscountPercentage => DiscountPrice.HasValue && Price > 0
        ? Math.Round(((Price - DiscountPrice.Value) / Price) * 100, 2)
        : null;
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool InStock => StockQuantity > 0;
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PublishedAt { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// Query filter parameters
public class ProductQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Search { get; set; }
    public Guid? CategoryId { get; set; }
    public string? Brand { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public bool? IsFeatured { get; set; }
    public bool? InStock { get; set; }
    public bool? IsActive { get; set; }
    public string? SortBy { get; set; } // name, price, newest, oldest
    public string? SortOrder { get; set; } // asc, desc
}