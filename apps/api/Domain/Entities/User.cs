// File: apps/api/Domain/Entities/User.cs
// Added: FailedLoginAttempts + LockedUntil for brute-force protection

using api.Domain.Common;
using api.Domain.Enums;

namespace api.Domain.Entities;

public class User : BaseEntity, ITenantEntity
{
    // Which tenant this user belongs to
    public Guid TenantId { get; set; }

    // Full name
    public string FullName { get; set; } = string.Empty;

    // Email (unique per tenant)
    public string Email { get; set; } = string.Empty;

    // Hashed password
    public string PasswordHash { get; set; } = string.Empty;

    // Phone number
    public string? Phone { get; set; }

    // User role (enum)
    public UserRole Role { get; set; } = UserRole.Customer;

    // Is email verified?
    public bool IsVerified { get; set; } = false;

    // Is account active?
    public bool IsActive { get; set; } = true;

    // Google OAuth ID
    public string? GoogleId { get; set; }

    // Profile picture URL
    public string? ProfileImage { get; set; }

    // Last successful login
    public DateTime? LastLoginAt { get; set; }

    // NEW: Failed login attempts counter (brute force protection)
    public int FailedLoginAttempts { get; set; } = 0;

    // NEW: Account locked until this time (null = not locked)
    public DateTime? LockedUntil { get; set; }

    // Helper: Is account currently locked?
    public bool IsLocked => LockedUntil.HasValue && LockedUntil.Value > DateTime.UtcNow;
}