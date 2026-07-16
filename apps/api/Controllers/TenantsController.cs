// File: apps/api/Controllers/TenantsController.cs
// Updated: Uses ITenantRepository instead of AppDbContext

using api.API.Attributes;
using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public TenantsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // GET all tenants — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpGet]
    public async Task<ActionResult<List<TenantDto>>> GetAll()
    {
        var tenants = await _unitOfWork.Tenants.GetAllAsync();

        var result = tenants.Select(t => new TenantDto
        {
            Id = t.Id,
            Name = t.Name,
            Slug = t.Slug,
            Domain = t.Domain,
            Status = t.Status,
            CreatedAt = t.CreatedAt
        }).ToList();

        return Ok(result);
    }

    // GET by ID — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TenantDto>> GetById(Guid id)
    {
        var tenant = await _unitOfWork.Tenants.GetByIdAsync(id);

        if (tenant == null)
        {
            return NotFound(new { message = "Tenant not found" });
        }

        return Ok(new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            Domain = tenant.Domain,
            Status = tenant.Status,
            CreatedAt = tenant.CreatedAt
        });
    }

    // POST create — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpPost]
    public async Task<ActionResult<TenantDto>> Create(CreateTenantDto dto)
    {
        var slugExists = await _unitOfWork.Tenants.SlugExistsAsync(dto.Slug);
        if (slugExists)
        {
            return BadRequest(new { message = $"Tenant with slug '{dto.Slug}' already exists" });
        }

        var tenant = new Tenant
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Domain = dto.Domain,
            Status = "active"
        };

        await _unitOfWork.Tenants.AddAsync(tenant);
        await _unitOfWork.SaveChangesAsync();

        var result = new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            Domain = tenant.Domain,
            Status = tenant.Status,
            CreatedAt = tenant.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, result);
    }
}