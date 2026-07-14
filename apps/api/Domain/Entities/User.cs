// File: apps/api/Domain/Entities/User.cs
// User table — customers, admins, sellers
// Every user belongs to a tenant (brand)
// So one email can register on multiple brands

using api.Domain.Common;

namespace api.Domain.Entities;

public class User : BaseEntity, ITenantEntity
{
    // Which tenant this user belongs to
    public Guid TenantId { get; set; }

    // Full name
    public string FullName { get; set; } = string.Empty;

    // Email (unique per tenant, not globally)
    public string Email { get; set; } = string.Empty;

    // Hashed password (never store plain password!)
    public string PasswordHash { get; set; } = string.Empty;

    // Phone number
    public string? Phone { get; set; }

    // Role: superadmin, admin, seller, customer
    public string Role { get; set; } = "customer";

    // Is email verified?
    public bool IsVerified { get; set; } = false;

    // Is account active?
    public bool IsActive { get; set; } = true;

    // Google login ID (if using Google OAuth)
    public string? GoogleId { get; set; }

    // Profile picture URL
    public string? ProfileImage { get; set; }
}