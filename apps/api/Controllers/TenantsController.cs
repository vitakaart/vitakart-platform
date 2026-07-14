// File: apps/api/Controllers/TenantsController.cs
// This controller handles all Tenant-related API endpoints
// Routes: /api/tenants
// Methods: GET all, GET by id, POST create

using api.Application.DTOs;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly AppDbContext _context;

    // Constructor — DbContext injected automatically
    public TenantsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tenants
    // Returns all tenants (not deleted)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TenantDto>>> GetAll()
    {
        var tenants = await _context.Tenants
            .Where(t => !t.IsDeleted)
            .Select(t => new TenantDto
            {
                Id = t.Id,
                Name = t.Name,
                Slug = t.Slug,
                Domain = t.Domain,
                LogoUrl = t.LogoUrl,
                Status = t.Status,
                Plan = t.Plan,
                ContactEmail = t.ContactEmail,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return Ok(tenants);
    }

    // GET: api/tenants/{id}
    // Returns one tenant by id
    [HttpGet("{id}")]
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
                LogoUrl = t.LogoUrl,
                Status = t.Status,
                Plan = t.Plan,
                ContactEmail = t.ContactEmail,
                CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (tenant == null)
        {
            return NotFound(new { message = "Tenant not found" });
        }

        return Ok(tenant);
    }

    // POST: api/tenants
    // Creates a new tenant
    [HttpPost]
    public async Task<ActionResult<TenantDto>> Create(CreateTenantDto dto)
    {
        // Check if slug already exists
        var slugExists = await _context.Tenants
            .AnyAsync(t => t.Slug == dto.Slug);

        if (slugExists)
        {
            return BadRequest(new { message = "Slug already exists" });
        }

        // Create new tenant
        var tenant = new Tenant
        {
            Name = dto.Name,
            Slug = dto.Slug,
            Domain = dto.Domain,
            ContactEmail = dto.ContactEmail,
            Status = "active",
            Plan = "free"
        };

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        // Return the created tenant
        var result = new TenantDto
        {
            Id = tenant.Id,
            Name = tenant.Name,
            Slug = tenant.Slug,
            Domain = tenant.Domain,
            LogoUrl = tenant.LogoUrl,
            Status = tenant.Status,
            Plan = tenant.Plan,
            ContactEmail = tenant.ContactEmail,
            CreatedAt = tenant.CreatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, result);
    }
}