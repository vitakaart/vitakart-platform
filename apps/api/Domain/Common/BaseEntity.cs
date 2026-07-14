// File: apps/api/Domain/Common/BaseEntity.cs
// This is the base for all our database tables
// Every entity (Product, User, Order) will inherit from this
// So we don't repeat Id, CreatedAt, UpdatedAt everywhere

namespace api.Domain.Common;

public abstract class BaseEntity
{
    // Unique ID for every record
    public Guid Id { get; set; } = Guid.NewGuid();

    // When was this record created
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // When was this record last updated
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Soft delete flag — instead of actually deleting
    // We just mark it as deleted
    public bool IsDeleted { get; set; } = false;
}