// File: apps/api/Infrastructure/Data/AppDbContext.cs
// Added Product → Category foreign key relationship

using api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tenant table rules
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasIndex(t => t.Slug).IsUnique();
            entity.HasIndex(t => t.Domain).IsUnique();
        });

        // User table rules
        modelBuilder.Entity<User>(entity =>
    {
        entity.HasIndex(u => new { u.Email, u.TenantId }).IsUnique();

        // Store enum as string in database (readable & flexible)
        entity.Property(u => u.Role)
            .HasConversion<string>()
            .HasMaxLength(20);
    });
        // Category table rules
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => new { c.Slug, c.TenantId }).IsUnique();

            entity.HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(c => c.ParentCategoryId);
        });

        // Product table rules (UPDATED)
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(p => new { p.Slug, p.TenantId }).IsUnique();

            entity.Property(p => p.Price).HasPrecision(10, 2);
            entity.Property(p => p.DiscountPrice).HasPrecision(10, 2);

            // Product → Category relationship
            entity.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for fast filtering
            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => new { p.TenantId, p.IsActive });
            entity.HasIndex(p => new { p.TenantId, p.IsFeatured });
        });

        // RefreshToken table rules
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.Property(e => e.Token)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.DeviceInfo)
                .HasMaxLength(500);

            entity.Property(e => e.IpAddress)
                .HasMaxLength(45);

            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.TenantId });

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}