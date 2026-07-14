// File: apps/api/API/Middleware/TenantResolverMiddleware.cs
// This middleware runs on EVERY request
// It reads tenant info from request header
// Then sets it in TenantContext for later use

using api.Application.Interfaces;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.API.Middleware;

public class TenantResolverMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolverMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(
        HttpContext context, 
        ITenantContext tenantContext,
        AppDbContext dbContext)
    {
        // Skip tenant check for these paths
        var path = context.Request.Path.Value?.ToLower() ?? "";
        
        if (path.StartsWith("/api/tenants") || 
            path.StartsWith("/openapi") ||
            path.StartsWith("/swagger"))
        {
            await _next(context);
            return;
        }

        // Try to get tenant from header
        // Frontend sends: X-Tenant-Slug: vitakart
        var tenantSlug = context.Request.Headers["X-Tenant-Slug"].FirstOrDefault();

        if (string.IsNullOrEmpty(tenantSlug))
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new 
            { 
                message = "X-Tenant-Slug header is required" 
            });
            return;
        }

        // Find tenant in database
        var tenant = await dbContext.Tenants
            .Where(t => t.Slug == tenantSlug && !t.IsDeleted && t.Status == "active")
            .Select(t => new { t.Id, t.Slug })
            .FirstOrDefaultAsync();

        if (tenant == null)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new 
            { 
                message = $"Tenant '{tenantSlug}' not found or inactive" 
            });
            return;
        }

        // Set tenant in context — now all services can access it
        tenantContext.SetTenant(tenant.Id, tenant.Slug);

        // Continue to next middleware
        await _next(context);
    }
}