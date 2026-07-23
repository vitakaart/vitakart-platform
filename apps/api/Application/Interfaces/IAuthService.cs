// File: apps/api/Application/Interfaces/IAuthService.cs
// Complete interface with ALL methods

using api.Application.DTOs;
using api.Domain.Enums;

namespace api.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? deviceInfo, string? ipAddress);
    Task<AuthResponseDto> LoginAsync(LoginDto dto, string? deviceInfo, string? ipAddress);

    // Get logged in user info from token
    Task<UserInfoDto> GetCurrentUserAsync(Guid userId);

    // Refresh access token using refresh token
    Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? deviceInfo, string? ipAddress);

    // Logout (revoke refresh token)
    Task LogoutAsync(string refreshToken);

    // Change user role (permission checks inside)
    Task<UserInfoDto> ChangeUserRoleAsync(Guid currentUserId, UserRole currentUserRole, ChangeRoleDto dto);


    Task<ProfileUpdatedDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto);

    // Password reset methods
    Task<ForgotPasswordResponseDto> ForgotPasswordAsync(string email, string? ipAddress);
    Task ResetPasswordAsync(string token, string newPassword);
}