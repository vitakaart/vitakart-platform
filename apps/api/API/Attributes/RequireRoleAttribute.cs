// File: apps/api/API/Attributes/RequireRoleAttribute.cs
// Fixed: Check both "role" and ClaimTypes.Role

using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace api.API.Attributes;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class RequireRoleAttribute : Attribute, IAuthorizationFilter
{
    private readonly UserRole _minimumRole;
    private readonly bool _exactMatch;

    public RequireRoleAttribute(UserRole minimumRole)
    {
        _minimumRole = minimumRole;
        _exactMatch = false;
    }

    public RequireRoleAttribute(UserRole role, bool exactMatch)
    {
        _minimumRole = role;
        _exactMatch = exactMatch;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        if (user?.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                message = "Authentication required"
            });
            return;
        }

        // FIXED: Try multiple claim names to find role
        var roleClaim = user.FindFirst("role")?.Value
                     ?? user.FindFirst(ClaimTypes.Role)?.Value
                     ?? user.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;

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

        var userRole = UserRoleExtensions.ParseRole(roleClaim);

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