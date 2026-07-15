// File: apps/api/Application/Interfaces/IJwtService.cs
// Added helper to get refresh token expiry days

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IJwtService
{
    // Generate access token (short lived, 60 min)
    string GenerateAccessToken(User user);

    // Generate refresh token (long lived, 7 days)
    string GenerateRefreshToken();

    // Get refresh token expiry days from config
    int GetRefreshTokenExpiryDays();
}