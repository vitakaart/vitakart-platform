// File: apps/api/Application/Services/TenantContext.cs
// This is the actual implementation of ITenantContext
// Stores current tenant info per request
// Scoped — new instance per HTTP request

using api.Application.Interfaces;

namespace api.Application.Services;

public class TenantContext : ITenantContext
{
    public Guid? TenantId { get; private set; }
    public string? TenantSlug { get; private set; }
    public bool IsResolved => TenantId.HasValue;

    public void SetTenant(Guid tenantId, string slug)
    {
        TenantId = tenantId;
        TenantSlug = slug;
    }
}