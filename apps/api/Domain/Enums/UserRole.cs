// File: apps/api/Domain/Enums/UserRole.cs
// Type-safe user roles with hierarchy
// Higher number = more permissions

namespace api.Domain.Enums;

public enum UserRole
{
    // Regular buyer — default for public registration
    Customer = 1,

    // Seller — manages own products (future feature)
    Vendor = 2,

    // Tenant admin — manages own tenant fully
    Admin = 3,

    // Platform owner — manages everything (all tenants)
    SuperAdmin = 4
}

// Extension methods for cleaner role checks
public static class UserRoleExtensions
{
    // Convert enum to string (for JWT claims)
    public static string ToRoleString(this UserRole role)
    {
        return role.ToString();
    }

    // Parse string to enum (from JWT claims)
    public static UserRole ParseRole(string roleString)
    {
        return Enum.TryParse<UserRole>(roleString, ignoreCase: true, out var role)
            ? role
            : UserRole.Customer;
    }

    // Check if role has at least this permission level
    public static bool HasPermissionOf(this UserRole userRole, UserRole requiredRole)
    {
        return (int)userRole >= (int)requiredRole;
    }
}