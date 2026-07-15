// File: apps/api/Application/DTOs/CategoryDto.cs
// All category related DTOs — create, update, response

namespace api.Application.DTOs;

// User sends this to create a category
public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public Guid? ParentCategoryId { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}

// User sends this to update a category
public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public Guid? ParentCategoryId { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}

// API returns this
public class CategoryDto
{
    public Guid Id { get; set; }
    public Guid? ParentCategoryId { get; set; }
    public string? ParentCategoryName { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public int SubCategoriesCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// API returns this for tree view (with children)
public class CategoryTreeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; }
    public List<CategoryTreeDto> Children { get; set; } = new();
}