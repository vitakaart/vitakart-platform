// File: apps/api/Application/Interfaces/ITenantContext.cs
// This interface defines what tenant info we can access
// Any service can inject this and know which tenant is calling

namespace api.Application.Interfaces;

public interface ITenantContext
{
    // Current tenant ID from request
    Guid? TenantId { get; }

    // Current tenant slug (like "vitakart")
    string? TenantSlug { get; }

    // Is tenant identified?
    bool IsResolved { get; }

    // Set tenant info (called by middleware)
    void SetTenant(Guid tenantId, string slug);
}