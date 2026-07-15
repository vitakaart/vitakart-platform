// File: apps/api/Application/Services/JwtService.cs
// Fixed: Convert enum to string for JWT claim

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace api.Application.Services;

public class JwtService : IJwtService
{
    public string GenerateAccessToken(User user)
    {
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET") 
            ?? throw new Exception("JWT_SECRET not set");
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "vitakart-api";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "vitakart-apps";
        var expiryMinutes = int.Parse(
            Environment.GetEnvironmentVariable("JWT_EXPIRY_MINUTES") ?? "60"
        );

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("fullName", user.FullName),
            new Claim("role", user.Role.ToRoleString()), // ✅ FIXED: enum → string
            new Claim("tenantId", user.TenantId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public int GetRefreshTokenExpiryDays()
    {
        return int.Parse(
            Environment.GetEnvironmentVariable("JWT_REFRESH_EXPIRY_DAYS") ?? "7"
        );
    }
}