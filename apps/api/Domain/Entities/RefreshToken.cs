// File: apps/api/Domain/Entities/RefreshToken.cs
// Stores refresh tokens in DB for security & revocation support

using api.Domain.Common;

namespace api.Domain.Entities;

public class RefreshToken : BaseEntity, ITenantEntity
{
    // Which tenant this token belongs to (multi-tenant)
    public Guid TenantId { get; set; }

    // Which user this token belongs to
    public Guid UserId { get; set; }

    // The actual refresh token string
    public string Token { get; set; } = string.Empty;

    // When this token expires
    public DateTime ExpiresAt { get; set; }

    // When user revoked this token (logout)
    public DateTime? RevokedAt { get; set; }

    // If revoked — which new token replaced it (rotation)
    public string? ReplacedByToken { get; set; }

    // Device/browser info (optional, for tracking)
    public string? DeviceInfo { get; set; }

    // IP address (optional, for security tracking)
    public string? IpAddress { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;

    // Helper properties
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt != null;
    public bool IsActive => !IsRevoked && !IsExpired;
}