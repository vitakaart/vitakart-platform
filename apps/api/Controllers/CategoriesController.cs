// File: apps/api/Controllers/CategoriesController.cs
// Updated: Added role-based restrictions

using api.API.Attributes;
using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET endpoints — PUBLIC (anyone can view)
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);
    }

    [HttpGet("top-level")]
    public async Task<ActionResult<List<CategoryDto>>> GetTopLevel()
    {
        var categories = await _categoryService.GetTopLevelAsync();
        return Ok(categories);
    }

    [HttpGet("tree")]
    public async Task<ActionResult<List<CategoryTreeDto>>> GetTree()
    {
        var tree = await _categoryService.GetTreeAsync();
        return Ok(tree);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id)
    {
        var category = await _categoryService.GetByIdAsync(id);
        return Ok(category);
    }

    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<CategoryDto>> GetBySlug(string slug)
    {
        var category = await _categoryService.GetBySlugAsync(slug);
        return Ok(category);
    }

    [HttpGet("{parentId:guid}/sub-categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetSubCategories(Guid parentId)
    {
        var categories = await _categoryService.GetSubCategoriesAsync(parentId);
        return Ok(categories);
    }

    // CREATE — Admin+ only
    [Authorize]
    [RequireRole(UserRole.Admin)]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    // UPDATE — Admin+ only
    [Authorize]
    [RequireRole(UserRole.Admin)]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> Update(Guid id, UpdateCategoryDto dto)
    {
        var category = await _categoryService.UpdateAsync(id, dto);
        return Ok(category);
    }

    // DELETE — Admin+ only
    [Authorize]
    [RequireRole(UserRole.Admin)]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        await _categoryService.DeleteAsync(id);
        return Ok(new { message = "Category deleted successfully" });
    }
}