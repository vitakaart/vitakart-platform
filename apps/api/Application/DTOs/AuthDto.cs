// File: apps/api/Application/DTOs/AuthDto.cs
// Added: ChangeRoleDto for role management

using api.Domain.Enums;

namespace api.Application.DTOs;

// User sends this when registering
public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
}

// User sends this when logging in
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

// API returns this after successful login/register
public class AuthResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public UserInfoDto User { get; set; } = new();
}

// User info returned in auth response
public class UserInfoDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsVerified { get; set; }
}

// Refresh token request
public class RefreshTokenRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}

// Logout request
public class LogoutRequestDto
{
    public string RefreshToken { get; set; } = string.Empty;
}

// NEW — Change user role (SuperAdmin/Admin only)
public class ChangeRoleDto
{
    public Guid UserId { get; set; }
    public UserRole NewRole { get; set; }
}