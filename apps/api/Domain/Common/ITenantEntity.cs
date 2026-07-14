// File: apps/api/Domain/Common/ITenantEntity.cs
// This interface makes sure every tenant-specific entity has tenantId
// So we can filter data per brand automatically
// Multi-tenant magic starts here!

namespace api.Domain.Common;

public interface ITenantEntity
{
    Guid TenantId { get; set; }
}