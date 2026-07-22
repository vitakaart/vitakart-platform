// File: apps/api/Domain/Entities/Address.cs
// User addresses — multiple per user, one default

using api.Domain.Common;
using api.Domain.Enums;

namespace api.Domain.Entities;

public class Address : BaseEntity, ITenantEntity
{
    // ==========================================
    // TENANT & USER
    // ==========================================

    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }

    // ==========================================
    // CONTACT INFO
    // ==========================================

    // Person receiving delivery
    public string FullName { get; set; } = string.Empty;

    // Contact number for delivery
    public string Phone { get; set; } = string.Empty;

    // ==========================================
    // ADDRESS DETAILS
    // ==========================================

    // House/Flat/Building number
    public string AddressLine1 { get; set; } = string.Empty;

    // Street/Area/Colony (optional)
    public string? AddressLine2 { get; set; }

    // Nearby landmark (optional)
    public string? Landmark { get; set; }

    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Pincode { get; set; } = string.Empty;
    public string Country { get; set; } = "India";

    // ==========================================
    // ADDRESS TYPE & PREFERENCES
    // ==========================================

    // Home, Office, Other
    public AddressType Type { get; set; } = AddressType.Home;

    // Is this the default address? (only one per user)
    public bool IsDefault { get; set; } = false;

    // ==========================================
    // NAVIGATION
    // ==========================================

    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}