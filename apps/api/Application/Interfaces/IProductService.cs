// File: apps/api/Application/Interfaces/IProductService.cs

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IProductService
{
    // Get paginated products with filters
    Task<PaginatedResultDto<ProductDto>> GetAllAsync(ProductQueryDto query);

    // Get featured products
    Task<List<ProductDto>> GetFeaturedAsync(int limit = 10);

    // Get product by ID
    Task<ProductDto> GetByIdAsync(Guid id);

    // Get product by slug (SEO friendly URL)
    Task<ProductDto> GetBySlugAsync(string slug);

    // Get products by category
    Task<PaginatedResultDto<ProductDto>> GetByCategoryAsync(Guid categoryId, ProductQueryDto query);

    // Create new product
    Task<ProductDto> CreateAsync(CreateProductDto dto);

    // Update product
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto);

    // Delete product (soft delete)
    Task DeleteAsync(Guid id);
}