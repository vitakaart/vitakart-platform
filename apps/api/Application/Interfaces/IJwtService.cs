// File: apps/api/Application/Interfaces/IJwtService.cs
// Contract for JWT token generation service

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IJwtService
{
    // Generate access token (short lived, 60 min)
    string GenerateAccessToken(User user);

    // Generate refresh token (long lived, 7 days)
    string GenerateRefreshToken();
}