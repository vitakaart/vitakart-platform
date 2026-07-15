// File: apps/api/Domain/Entities/User.cs
// Updated: Role changed from string to UserRole enum (type-safe)
// All existing fields preserved

using api.Domain.Common;
using api.Domain.Enums;

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

    // Role: Customer, Vendor, Admin, SuperAdmin (type-safe enum)
    public UserRole Role { get; set; } = UserRole.Customer;

    // Is email verified?
    public bool IsVerified { get; set; } = false;

    // Is account active?
    public bool IsActive { get; set; } = true;

    // Google login ID (if using Google OAuth)
    public string? GoogleId { get; set; }

    // Profile picture URL
    public string? ProfileImage { get; set; }

    // Optional: track last login for security
    public DateTime? LastLoginAt { get; set; }
}