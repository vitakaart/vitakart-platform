// File: apps/api/Application/Services/AuthService.cs
// Handles register and login business logic
// Uses BCrypt to hash passwords securely

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Application.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly ITenantContext _tenantContext;

    public AuthService(
        AppDbContext context, 
        IJwtService jwtService,
        ITenantContext tenantContext)
    {
        _context = context;
        _jwtService = jwtService;
        _tenantContext = tenantContext;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        // Check tenant is set (from middleware)
        if (!_tenantContext.IsResolved)
        {
            throw new Exception("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        // Check if email already exists for this tenant
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email && u.TenantId == tenantId);

        if (emailExists)
        {
            throw new Exception("Email already registered");
        }

        // Hash password (never store plain password!)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // Create new user
        var user = new User
        {
            TenantId = tenantId,
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = passwordHash,
            Phone = dto.Phone,
            Role = "customer",
            IsVerified = false,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate tokens
        return new AuthResponseDto
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = _jwtService.GenerateRefreshToken(),
            User = new UserInfoDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsVerified = user.IsVerified
            }
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        if (!_tenantContext.IsResolved)
        {
            throw new Exception("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        // Find user by email and tenant
        var user = await _context.Users
            .FirstOrDefaultAsync(u => 
                u.Email == dto.Email && 
                u.TenantId == tenantId && 
                !u.IsDeleted);

        if (user == null)
        {
            throw new Exception("Invalid email or password");
        }

        if (!user.IsActive)
        {
            throw new Exception("Account is deactivated");
        }

        // Verify password
        var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!passwordValid)
        {
            throw new Exception("Invalid email or password");
        }

        // Generate tokens
        return new AuthResponseDto
        {
            AccessToken = _jwtService.GenerateAccessToken(user),
            RefreshToken = _jwtService.GenerateRefreshToken(),
            User = new UserInfoDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                IsVerified = user.IsVerified
            }
        };
    }
}