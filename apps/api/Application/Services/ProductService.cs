// File: apps/api/Application/Services/ProductService.cs
// Full product CRUD with pagination, search, filters, sorting

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Application.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly ITenantContext _tenantContext;

    public ProductService(AppDbContext context, ITenantContext tenantContext)
    {
        _context = context;
        _tenantContext = tenantContext;
    }

    // Get all products with pagination + filters + search + sorting
    public async Task<PaginatedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query)
    {
        var tenantId = GetTenantId();

        // Base query
        var productsQuery = _context.Products
            .Include(p => p.Category)
            .Where(p => p.TenantId == tenantId && !p.IsDeleted);

        // Apply filters
        productsQuery = ApplyFilters(productsQuery, query);

        // Apply sorting
        productsQuery = ApplySorting(productsQuery, query);

        // Get total count (before pagination)
        var totalCount = await productsQuery.CountAsync();

        // Apply pagination
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

    // Get featured products
    public async Task<List<ProductDto>> GetFeaturedAsync(int limit = 10)
    {
        var tenantId = GetTenantId();

        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.TenantId == tenantId
                     && !p.IsDeleted
                     && p.IsActive
                     && p.IsFeatured)
            .OrderByDescending(p => p.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return products.Select(MapToDto).ToList();
    }

    // Get by ID
    public async Task<ProductDto> GetByIdAsync(Guid id)
    {
        var tenantId = GetTenantId();

        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id
                                   && p.TenantId == tenantId
                                   && !p.IsDeleted);

        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        return MapToDto(product);
    }

    // Get by slug (SEO URLs)
    public async Task<ProductDto> GetBySlugAsync(string slug)
    {
        var tenantId = GetTenantId();

        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug
                                   && p.TenantId == tenantId
                                   && !p.IsDeleted);

        if (product == null)
        {
            throw new NotFoundException($"Product with slug '{slug}' not found");
        }

        return MapToDto(product);
    }

    // Get products by category
    public async Task<PaginatedResultDto<ProductDto>> GetByCategoryAsync(Guid categoryId, ProductQueryDto query)
    {
        query.CategoryId = categoryId;
        return await GetAllAsync(query);
    }

    // Create product
    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var tenantId = GetTenantId();

        // Validate category exists
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dto.CategoryId
                        && c.TenantId == tenantId
                        && !c.IsDeleted);

        if (!categoryExists)
        {
            throw new ValidationException("Category not found");
        }

        // Check slug uniqueness
        var slugExists = await _context.Products
            .AnyAsync(p => p.Slug == dto.Slug
                        && p.TenantId == tenantId
                        && !p.IsDeleted);

        if (slugExists)
        {
            throw new ValidationException($"Product with slug '{dto.Slug}' already exists");
        }

        // Validate discount price
        if (dto.DiscountPrice.HasValue && dto.DiscountPrice.Value >= dto.Price)
        {
            throw new ValidationException("Discount price must be less than regular price");
        }

        var product = new Product
        {
            TenantId = tenantId,
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

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    // Update product
    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var tenantId = GetTenantId();

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id
                                   && p.TenantId == tenantId
                                   && !p.IsDeleted);

        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Validate category
        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == dto.CategoryId
                        && c.TenantId == tenantId
                        && !c.IsDeleted);

        if (!categoryExists)
        {
            throw new ValidationException("Category not found");
        }

        // Check slug uniqueness (exclude current)
        var slugExists = await _context.Products
            .AnyAsync(p => p.Slug == dto.Slug
                        && p.TenantId == tenantId
                        && p.Id != id
                        && !p.IsDeleted);

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
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id);
    }

    // Delete product (soft delete)
    public async Task DeleteAsync(Guid id)
    {
        var tenantId = GetTenantId();

        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id
                                   && p.TenantId == tenantId
                                   && !p.IsDeleted);

        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private Guid GetTenantId()
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }
        return _tenantContext.TenantId!.Value;
    }

    // Apply filters to query
    private IQueryable<Product> ApplyFilters(IQueryable<Product> query, ProductQueryDto filter)
    {
        // Search by name or brand
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                (p.Brand != null && p.Brand.ToLower().Contains(search)) ||
                (p.Sku != null && p.Sku.ToLower().Contains(search)));
        }

        // Filter by category
        if (filter.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filter.CategoryId.Value);
        }

        // Filter by brand
        if (!string.IsNullOrWhiteSpace(filter.Brand))
        {
            query = query.Where(p => p.Brand == filter.Brand);
        }

        // Filter by price range
        if (filter.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filter.MinPrice.Value);
        }

        if (filter.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);
        }

        // Filter by featured
        if (filter.IsFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == filter.IsFeatured.Value);
        }

        // Filter by stock
        if (filter.InStock.HasValue)
        {
            if (filter.InStock.Value)
                query = query.Where(p => p.StockQuantity > 0);
            else
                query = query.Where(p => p.StockQuantity == 0);
        }

        // Filter by active
        if (filter.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == filter.IsActive.Value);
        }

        return query;
    }

    // Apply sorting to query
    private IQueryable<Product> ApplySorting(IQueryable<Product> query, ProductQueryDto filter)
    {
        var sortBy = filter.SortBy?.ToLower() ?? "newest";
        var isDesc = filter.SortOrder?.ToLower() == "desc";

        query = sortBy switch
        {
            "name" => isDesc
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),

            "price" => isDesc
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),

            "oldest" => query.OrderBy(p => p.CreatedAt),

            _ => query.OrderByDescending(p => p.CreatedAt) // newest (default)
        };

        return query;
    }

    // Map entity to DTO
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