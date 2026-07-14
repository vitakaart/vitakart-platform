// File: apps/api/Infrastructure/Data/AppDbContext.cs
// This is the brain of our database
// It knows all tables and how to connect to PostgreSQL
// Entity Framework uses this to create migrations and run queries

using api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    // Constructor — receives DB configuration
    public AppDbContext(DbContextOptions<AppDbContext> options) 
        : base(options)
    {
    }

    // Each DbSet becomes a table in the database
    // Table names will be plural (Tenants, Users, etc.)
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }

    // This runs when Entity Framework creates the tables
    // We add constraints and indexes here
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tenant table rules
        modelBuilder.Entity<Tenant>(entity =>
        {
            // Slug should be unique (no two tenants can have same slug)
            entity.HasIndex(t => t.Slug).IsUnique();
            
            // Domain should be unique
            entity.HasIndex(t => t.Domain).IsUnique();
        });

        // User table rules
        modelBuilder.Entity<User>(entity =>
        {
            // Email + TenantId combo should be unique
            // Same email can exist in different tenants
            entity.HasIndex(u => new { u.Email, u.TenantId }).IsUnique();
        });

        // Category table rules
        modelBuilder.Entity<Category>(entity =>
        {
            // Slug + TenantId combo should be unique
            entity.HasIndex(c => new { c.Slug, c.TenantId }).IsUnique();
        });

        // Product table rules
        modelBuilder.Entity<Product>(entity =>
        {
            // Slug + TenantId combo should be unique
            entity.HasIndex(p => new { p.Slug, p.TenantId }).IsUnique();

            // Price with decimal precision
            entity.Property(p => p.Price).HasPrecision(10, 2);
        });
    }
}