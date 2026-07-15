// File: apps/api/API/Middleware/TenantResolverMiddleware.cs
// Updated: SuperAdmin can bypass tenant header (access all tenants)

using api.Application.Interfaces;
using api.Domain.Enums;
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
        // Skip tenant check for public/system paths
        var path = context.Request.Path.Value?.ToLower() ?? "";
        
        if (path.StartsWith("/api/tenants") || 
            path.StartsWith("/openapi") ||
            path.StartsWith("/swagger") ||
            path.StartsWith("/scalar"))
        {
            await _next(context);
            return;
        }

        // Check if user is SuperAdmin (bypass tenant header requirement)
        var isSuperAdmin = false;
        if (context.User?.Identity?.IsAuthenticated == true)
        {
            var roleClaim = context.User.FindFirst("role")?.Value;
            if (!string.IsNullOrEmpty(roleClaim))
            {
                var role = UserRoleExtensions.ParseRole(roleClaim);
                isSuperAdmin = role == UserRole.SuperAdmin;
            }
        }

        // Get tenant slug from header
        var tenantSlug = context.Request.Headers["X-Tenant-Slug"].FirstOrDefault();

        // SuperAdmin can work without tenant header (accesses all tenants)
        if (isSuperAdmin && string.IsNullOrEmpty(tenantSlug))
        {
            await _next(context);
            return;
        }

        // For everyone else — tenant header required
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