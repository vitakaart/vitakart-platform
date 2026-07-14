// File: apps/api/Domain/Entities/Category.cs
// Product categories — e.g., "Supplements", "Fitness", "Personal Care"
// Every category belongs to a tenant
// So different brands can have different categories

using api.Domain.Common;

namespace api.Domain.Entities;

public class Category : BaseEntity, ITenantEntity
{
    // Which tenant this category belongs to
    public Guid TenantId { get; set; }

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
}