// File: apps/api/Controllers/TenantsController.cs
// Updated: Only SuperAdmin can create/manage tenants

using api.API.Attributes;
using api.Application.DTOs;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TenantsController(AppDbContext context)
    {
        _context = context;
    }

    // GET all tenants — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpGet]
    public async Task<ActionResult<List<TenantDto>>> GetAll()
    {
        var tenants = await _context.Tenants
            .Where(t => !t.IsDeleted)
            .Select(t => new TenantDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Domain = t.Domain,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(tenants);
    }

    // GET tenant by ID — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TenantDto>> GetById(Guid id)
    {
        var tenant = await _context.Tenants
            .Where(t => t.Id == id && !t.IsDeleted)
            .Select(t => new TenantDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Domain = t.Domain,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (tenant == null)
        {
            return NotFound(new { message = "Tenant not found" });
        }

        return Ok(tenant);
    }

    // POST create tenant — SuperAdmin only
    [Authorize]
    [RequireRole(UserRole.SuperAdmin)]
    [HttpPost]
    public async Task<ActionResult<TenantDto>> Create(CreateTenantDto dto)
    {
        var slugExists = await _context.Tenants
            .AnyAsync(t => t.Slug == dto.Slug && !t.IsDeleted);

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

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

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