// File: apps/api/Application/Interfaces/IAuthService.cs
// Added GetCurrentUserAsync method

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    
    // Get logged in user info from token
    Task<UserInfoDto> GetCurrentUserAsync(Guid userId);
}