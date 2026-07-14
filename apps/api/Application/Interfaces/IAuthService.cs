// File: apps/api/Application/Interfaces/IAuthService.cs
// Contract for authentication operations

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IAuthService
{
    // Register new user, returns tokens
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);

    // Login existing user, returns tokens
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}