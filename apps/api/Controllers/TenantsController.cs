// File: apps/api/Controllers/TenantsController.cs
// POST endpoint now requires authentication

using api.Application.DTOs;
using api.Domain.Entities;
using api.Domain.Exceptions;
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

    // GET: api/tenants — Public
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

    // GET: api/tenants/{id} — Public
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
            throw new NotFoundException("Tenant not found");
        }

        return Ok(tenant);
    }

    // POST: api/tenants — PROTECTED (need token)
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<TenantDto>> Create(CreateTenantDto dto)
    {
        var slugExists = await _context.Tenants
            .AnyAsync(t => t.Slug == dto.Slug);

        if (slugExists)
        {
            throw new ValidationException("Slug already exists");
        }

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