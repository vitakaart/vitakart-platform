// File: apps/api/Domain/Entities/Category.cs
// Added ParentCategoryId for nested categories (parent-child hierarchy)

using api.Domain.Common;

namespace api.Domain.Entities;

public class Category : BaseEntity, ITenantEntity
{
    // Which tenant this category belongs to
    public Guid TenantId { get; set; }

    // Parent category ID (null = top level category)
    // Example: "Vitamins" ka parent "Health Supplements" hoga
    public Guid? ParentCategoryId { get; set; }

    // Category name — e.g., "Supplements"
    public string Name { get; set; } = string.Empty;

    // URL slug — e.g., "supplements"
    public string Slug { get; set; } = string.Empty;

    // Short description
    public string? Description { get; set; }

    // Category image URL
    public string? ImageUrl { get; set; }

    // Sort order for display
    public int SortOrder { get; set; } = 0;

    // Is category visible on site?
    public bool IsActive { get; set; } = true;

    // SEO fields
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation properties
    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();
}