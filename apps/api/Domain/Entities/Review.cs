// File: apps/api/Domain/Entities/Review.cs
// Product review with rating

using api.Domain.Common;

namespace api.Domain.Entities;

public class Review : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }

    // Order ID for verified purchase (optional)
    public Guid? OrderId { get; set; }

    // Rating: 1 to 5
    public int Rating { get; set; }

    // Review title (optional short summary)
    public string? Title { get; set; }

    // Review comment
    public string Comment { get; set; } = string.Empty;

    // Is this from a verified purchase?
    public bool IsVerifiedPurchase { get; set; } = false;

    // Number of helpful votes (future feature)
    public int HelpfulCount { get; set; } = 0;

    // Navigation properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}