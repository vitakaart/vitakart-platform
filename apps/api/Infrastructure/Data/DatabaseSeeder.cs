// File: apps/api/Infrastructure/Data/DatabaseSeeder.cs
// Auto-seeds SuperAdmin on first application startup
// Idempotent — safe to run multiple times

using api.Domain.Entities;
using api.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        try
        {
            // Ensure DB is created
            await context.Database.EnsureCreatedAsync();

            // Get SuperAdmin credentials from environment
            var superAdminEmail = Environment.GetEnvironmentVariable("SUPERADMIN_EMAIL") 
                ?? "superadmin@vitakart.com";
            var superAdminPassword = Environment.GetEnvironmentVariable("SUPERADMIN_PASSWORD") 
                ?? "SuperAdmin@123";
            var superAdminName = Environment.GetEnvironmentVariable("SUPERADMIN_NAME") 
                ?? "Super Admin";

            // Get default tenant slug for SuperAdmin (or first tenant)
            var defaultTenant = await context.Tenants
                .Where(t => !t.IsDeleted)
                .OrderBy(t => t.CreatedAt)
                .FirstOrDefaultAsync();

            if (defaultTenant == null)
            {
                logger.LogWarning("⚠️  No tenant found. Skipping SuperAdmin seed. Create a tenant first.");
                return;
            }

            // Check if SuperAdmin already exists (any tenant)
            var superAdminExists = await context.Users
                .AnyAsync(u => u.Role == UserRole.SuperAdmin && !u.IsDeleted);

            if (superAdminExists)
            {
                logger.LogInformation("✅ SuperAdmin already exists. Skipping seed.");
                return;
            }

            // Create SuperAdmin
            var superAdmin = new User
            {
                TenantId = defaultTenant.Id,
                FullName = superAdminName,
                Email = superAdminEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(superAdminPassword),
                Role = UserRole.SuperAdmin,
                IsVerified = true,
                IsActive = true
            };

            context.Users.Add(superAdmin);
            await context.SaveChangesAsync();

            logger.LogInformation("🎉 SuperAdmin created successfully!");
            logger.LogInformation("📧 Email: {Email}", superAdminEmail);
            logger.LogInformation("🔑 Password: {Password}", superAdminPassword);
            logger.LogInformation("🏢 Tenant: {TenantSlug}", defaultTenant.Slug);
            logger.LogWarning("⚠️  IMPORTANT: Change SuperAdmin password after first login!");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌ Error seeding database");
        }
    }
}