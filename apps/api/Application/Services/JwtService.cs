// File: apps/api/Application/Services/JwtService.cs
// Actually creates JWT tokens
// Access token contains user info (id, email, role, tenant)

using api.Application.Interfaces;
using api.Domain.Entities;
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
        // Get JWT settings from environment
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET") 
            ?? throw new Exception("JWT_SECRET not set");
        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "vitakart-api";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "vitakart-apps";
        var expiryMinutes = int.Parse(
            Environment.GetEnvironmentVariable("JWT_EXPIRY_MINUTES") ?? "60"
        );

        // Claims = data stored inside token
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("fullName", user.FullName),
            new Claim("role", user.Role),
            new Claim("tenantId", user.TenantId.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Create signing key from secret
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create the token
        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        // Convert to string
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        // Generate secure random string for refresh token
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}