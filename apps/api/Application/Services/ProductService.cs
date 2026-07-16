// File: apps/api/Application/Services/ProductService.cs
// Rewritten to use IUnitOfWork

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace api.Application.Services;

public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    public ProductService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // Get all with pagination, filters, sorting
    public async Task<PaginatedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query)
    {
        ValidateTenant();

        // Start with base query (auto multi-tenant + soft delete filtered)
        var productsQuery = _unitOfWork.Products.QueryWithCategory();

        // Apply filters
        productsQuery = ApplyFilters(productsQuery, query);

        // Apply sorting
        productsQuery = ApplySorting(productsQuery, query);

        // Count total
        var totalCount = await productsQuery.CountAsync();

        // Pagination
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 20 : Math.Min(query.PageSize, 100);

        var products = await productsQuery
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginatedResultDto<ProductDto>
        {
            Items = products.Select(MapToDto).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    // Get featured
    public async Task<List<ProductDto>> GetFeaturedAsync(int limit = 10)
    {
        ValidateTenant();

        var products = await _unitOfWork.Products.GetFeaturedAsync(limit);
        return products.Select(MapToDto).ToList();
    }

    // Get by ID
    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        ValidateTenant();

        var product = await _unitOfWork.Products.GetByIdWithCategoryAsync(id);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        return MapToDto(product);
    }

    // Get by slug
    public async Task<ProductDto> GetBySlugAsync(string slug)
    {
        ValidateTenant();

        var product = await _unitOfWork.Products.GetBySlugAsync(slug);
        if (product == null)
        {
            throw new NotFoundException($"Product with slug '{slug}' not found");
        }

        return MapToDto(product);
    }

    // Get by category
    public async Task<PaginatedResultDto<ProductDto>> GetByCategoryAsync(Guid categoryId, ProductQueryDto query)
    {
        query.CategoryId = categoryId;
        return await GetAllAsync(query);
    }

    // Create
    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        ValidateTenant();

        // Validate category
        var categoryExists = await _unitOfWork.Categories.ExistsAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            throw new ValidationException("Category not found");
        }

        // Check slug uniqueness
        var slugExists = await _unitOfWork.Products.SlugExistsAsync(dto.Slug);
        if (slugExists)
        {
            throw new ValidationException($"Product with slug '{dto.Slug}' already exists");
        }

        // Validate discount
        if (dto.DiscountPrice.HasValue && dto.DiscountPrice.Value >= dto.Price)
        {
            throw new ValidationException("Discount price must be less than regular price");
        }

        var product = new Product
        {
            CategoryId = dto.CategoryId,
            Name = dto.Name,
            Slug = dto.Slug,
            Sku = dto.Sku,
            Description = dto.Description,
            ShortDescription = dto.ShortDescription,
            Brand = dto.Brand,
            Price = dto.Price,
            DiscountPrice = dto.DiscountPrice,
            ImageUrl = dto.ImageUrl,
            StockQuantity = dto.StockQuantity,
            IsFeatured = dto.IsFeatured,
            IsActive = dto.IsActive,
            PublishedAt = dto.PublishedAt ?? DateTime.UtcNow,
            MetaTitle = dto.MetaTitle,
            MetaDescription = dto.MetaDescription,
            MetaKeywords = dto.MetaKeywords
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    // Update
    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        ValidateTenant();

        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Validate category
        var categoryExists = await _unitOfWork.Categories.ExistsAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            throw new ValidationException("Category not found");
        }

        // Check slug uniqueness
        var slugExists = await _unitOfWork.Products.SlugExistsAsync(dto.Slug, id);
        if (slugExists)
        {
            throw new ValidationException($"Product with slug '{dto.Slug}' already exists");
        }

        // Validate discount
        if (dto.DiscountPrice.HasValue && dto.DiscountPrice.Value >= dto.Price)
        {
            throw new ValidationException("Discount price must be less than regular price");
        }

        // Update fields
        product.CategoryId = dto.CategoryId;
        product.Name = dto.Name;
        product.Slug = dto.Slug;
        product.Sku = dto.Sku;
        product.Description = dto.Description;
        product.ShortDescription = dto.ShortDescription;
        product.Brand = dto.Brand;
        product.Price = dto.Price;
        product.DiscountPrice = dto.DiscountPrice;
        product.ImageUrl = dto.ImageUrl;
        product.StockQuantity = dto.StockQuantity;
        product.IsFeatured = dto.IsFeatured;
        product.IsActive = dto.IsActive;
        product.PublishedAt = dto.PublishedAt;
        product.MetaTitle = dto.MetaTitle;
        product.MetaDescription = dto.MetaDescription;
        product.MetaKeywords = dto.MetaKeywords;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    // Delete
    public async Task DeleteAsync(Guid id)
    {
        ValidateTenant();

        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        _unitOfWork.Products.SoftDelete(product);
        await _unitOfWork.SaveChangesAsync();
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private void ValidateTenant()
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }
    }

    private IQueryable<Product> ApplyFilters(IQueryable<Product> query, ProductQueryDto filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                (p.Brand != null && p.Brand.ToLower().Contains(search)) ||
                (p.Sku != null && p.Sku.ToLower().Contains(search)));
        }

        if (filter.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);

        if (!string.IsNullOrWhiteSpace(filter.Brand))
            query = query.Where(p => p.Brand == filter.Brand);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (filter.IsFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);

        if (filter.InStock.HasValue)
        {
            query = filter.InStock.Value
                ? query.Where(p => p.StockQuantity > 0)
                : query.Where(p => p.StockQuantity == 0);
        }

        if (filter.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filter.IsActive.Value);

        return query;
    }

    private IQueryable<Product> ApplySorting(IQueryable<Product> query, ProductQueryDto filter)
    {
        var sortBy = filter.SortBy?.ToLower() ?? "newest";
        var isDesc = filter.SortOrder?.ToLower() == "desc";

        return sortBy switch
        {
            "name" => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "price" => isDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "oldest" => query.OrderBy(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };
    }

    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name ?? string.Empty,
            CategorySlug = product.Category?.Slug ?? string.Empty,
            Name = product.Name,
            Slug = product.Slug,
            Sku = product.Sku,
            Description = product.Description,
            ShortDescription = product.ShortDescription,
            Brand = product.Brand,
            Price = product.Price,
            DiscountPrice = product.DiscountPrice,
            ImageUrl = product.ImageUrl,
            StockQuantity = product.StockQuantity,
            IsFeatured = product.IsFeatured,
            IsActive = product.IsActive,
            PublishedAt = product.PublishedAt,
            MetaTitle = product.MetaTitle,
            MetaDescription = product.MetaDescription,
            MetaKeywords = product.MetaKeywords,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };
    }
}