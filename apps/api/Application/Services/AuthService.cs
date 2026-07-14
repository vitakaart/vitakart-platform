// File: apps/api/Application/Services/AuthService.cs
// Added GetCurrentUserAsync method

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;
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
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email && u.TenantId == tenantId);

        if (emailExists)
        {
            throw new ValidationException("Email already registered");
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

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
            throw new ValidationException("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        var user = await _context.Users
            .FirstOrDefaultAsync(u => 
                u.Email == dto.Email && 
                u.TenantId == tenantId && 
                !u.IsDeleted);

        if (user == null)
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedException("Account is deactivated");
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!passwordValid)
        {
            throw new UnauthorizedException("Invalid email or password");
        }

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

    // NEW METHOD — Get current user info
    public async Task<UserInfoDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId && !u.IsDeleted && u.IsActive)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        return new UserInfoDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            IsVerified = user.IsVerified
        };
    }
}