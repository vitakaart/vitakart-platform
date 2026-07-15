// File: apps/api/Controllers/ProductsController.cs
// Updated: Role-based restrictions
// Vendor+ can create/update, Admin+ can delete

using api.API.Attributes;
using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // GET endpoints — PUBLIC
    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<ProductDto>>> GetAll([FromQuery] ProductQueryDto query)
    {
        var result = await _productService.GetAllAsync(query);
        return Ok(result);
    }

    [HttpGet("featured")]
    public async Task<ActionResult<List<ProductDto>>> GetFeatured([FromQuery] int limit = 10)
    {
        var products = await _productService.GetFeaturedAsync(limit);
        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);
        return Ok(product);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ProductDto>> GetBySlug(string slug)
    {
        var product = await _productService.GetBySlugAsync(slug);
        return Ok(product);
    }

    [HttpGet("category/{categoryId:guid}")]
    public async Task<ActionResult<PaginatedResultDto<ProductDto>>> GetByCategory(
        Guid categoryId,
        [FromQuery] ProductQueryDto query)
    {
        var result = await _productService.GetByCategoryAsync(categoryId, query);
        return Ok(result);
    }

    // CREATE — Vendor+ (Vendor, Admin, SuperAdmin)
    [Authorize]
    [RequireRole(UserRole.Vendor)]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        var product = await _productService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    // UPDATE — Vendor+ (Vendor, Admin, SuperAdmin)
    [Authorize]
    [RequireRole(UserRole.Vendor)]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, UpdateProductDto dto)
    {
        var product = await _productService.UpdateAsync(id, dto);
        return Ok(product);
    }

    // DELETE — Admin+ only (stricter permission)
    [Authorize]
    [RequireRole(UserRole.Admin)]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _productService.DeleteAsync(id);
        return Ok(new { message = "Product deleted successfully" });
    }
}