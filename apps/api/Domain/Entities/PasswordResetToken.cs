// File: apps/api/Domain/Entities/PasswordResetToken.cs
// Token for password reset flow

using api.Domain.Common;

namespace api.Domain.Entities;

public class PasswordResetToken : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }

    // The reset token (random string)
    public string Token { get; set; } = string.Empty;

    // When token expires (typically 15-30 min)
    public DateTime ExpiresAt { get; set; }

    // Has token been used already?
    public bool IsUsed { get; set; } = false;

    // When was it used
    public DateTime? UsedAt { get; set; }

    // IP address of request (for security logs)
    public string? IpAddress { get; set; }

    // Navigation
    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;

    // Helper
    public bool IsValid => !IsUsed && ExpiresAt > DateTime.UtcNow;
}