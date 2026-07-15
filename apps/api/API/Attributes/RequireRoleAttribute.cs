// File: apps/api/API/Attributes/RequireRoleAttribute.cs
// Custom attribute for role-based endpoint protection
// Usage: [RequireRole(UserRole.Admin)]
// Supports hierarchy - Admin also passes RequireRole(Customer)

using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.API.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class RequireRoleAttribute : Attribute, IAuthorizationFilter
{
    private readonly UserRole _minimumRole;
    private readonly bool _exactMatch;

    // Constructor 1: minimum role (hierarchy)
    // Example: [RequireRole(UserRole.Admin)] 
    // → Admin AND SuperAdmin can access
    public RequireRoleAttribute(UserRole minimumRole)
    {
        _minimumRole = minimumRole;
        _exactMatch = false;
    }

    // Constructor 2: exact role match
    // Example: [RequireRole(UserRole.Admin, exactMatch: true)]
    // → Only Admin (not SuperAdmin)
    public RequireRoleAttribute(UserRole role, bool exactMatch)
    {
        _minimumRole = role;
        _exactMatch = exactMatch;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Check if user is authenticated
        var user = context.HttpContext.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                message = "Authentication required"
            });
            return;
        }

        // Get role from JWT claim
        var roleClaim = user.FindFirst("role")?.Value;

        if (string.IsNullOrEmpty(roleClaim))
        {
            context.Result = new ObjectResult(new
            {
                message = "Role information missing from token"
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
            return;
        }

        // Parse role
        var userRole = UserRoleExtensions.ParseRole(roleClaim);

        // Check permission
        bool hasAccess = _exactMatch
            ? userRole == _minimumRole
            : userRole.HasPermissionOf(_minimumRole);

        if (!hasAccess)
        {
            context.Result = new ObjectResult(new
            {
                message = $"Access denied. Required role: {_minimumRole} or higher",
                yourRole = userRole.ToString()
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }
    }
}