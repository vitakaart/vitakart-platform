// File: apps/api/Domain/Entities/Wishlist.cs
// User's wishlist item — links User + Product

using api.Domain.Common;

namespace api.Domain.Entities;

public class Wishlist : BaseEntity, ITenantEntity
{
    public Guid TenantId { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public Tenant Tenant { get; set; } = null!;
}