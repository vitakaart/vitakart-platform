// File: apps/api/Application/Services/AuthService.cs
// Complete file with ALL methods — nothing missing

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
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

    // ==========================================
    // REGISTER
    // ==========================================
    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? deviceInfo, string? ipAddress)
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
            Role = UserRole.Customer,
            IsVerified = false,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, tenantId, deviceInfo, ipAddress);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapToUserInfo(user)
        };
    }

    // ==========================================
    // LOGIN
    // ==========================================
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, string? deviceInfo, string? ipAddress)
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

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, tenantId, deviceInfo, ipAddress);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapToUserInfo(user)
        };
    }

    // ==========================================
    // GET CURRENT USER (Ye Missing Tha!)
    // ==========================================
    public async Task<UserInfoDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId && !u.IsDeleted && u.IsActive)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        return MapToUserInfo(user);
    }

    // ==========================================
    // REFRESH TOKEN
    // ==========================================
    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, string? deviceInfo, string? ipAddress)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new ValidationException("Refresh token is required");
        }

        var existingToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (existingToken == null)
        {
            throw new UnauthorizedException("Invalid refresh token");
        }

        if (!existingToken.IsActive)
        {
            throw new UnauthorizedException("Refresh token expired or revoked");
        }

        if (existingToken.User == null || existingToken.User.IsDeleted || !existingToken.User.IsActive)
        {
            throw new UnauthorizedException("User not found or inactive");
        }

        // ROTATION: Revoke old & create new
        var newRefreshToken = _jwtService.GenerateRefreshToken();

        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.ReplacedByToken = newRefreshToken;
        existingToken.UpdatedAt = DateTime.UtcNow;

        var newTokenEntity = new RefreshToken
        {
            TenantId = existingToken.TenantId,
            UserId = existingToken.UserId,
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenExpiryDays()),
            DeviceInfo = deviceInfo,
            IpAddress = ipAddress
        };

        _context.RefreshTokens.Add(newTokenEntity);
        await _context.SaveChangesAsync();

        var newAccessToken = _jwtService.GenerateAccessToken(existingToken.User);

        return new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            User = MapToUserInfo(existingToken.User)
        };
    }

    // ==========================================
    // LOGOUT
    // ==========================================
    public async Task LogoutAsync(string refreshToken)
    {
        if (string.IsNullOrEmpty(refreshToken))
        {
            throw new ValidationException("Refresh token is required");
        }

        var token = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

        if (token == null)
        {
            return;
        }

        if (token.IsActive)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    // ==========================================
    // CHANGE USER ROLE
    // ==========================================
    public async Task<UserInfoDto> ChangeUserRoleAsync(Guid currentUserId, UserRole currentUserRole, ChangeRoleDto dto)
    {
        // Only SuperAdmin and Admin can change roles
        if (currentUserRole != UserRole.SuperAdmin && currentUserRole != UserRole.Admin)
        {
            throw new UnauthorizedException("Only Admin or SuperAdmin can change roles");
        }

        // Find target user
        var targetUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == dto.UserId && !u.IsDeleted);

        if (targetUser == null)
        {
            throw new NotFoundException("User not found");
        }

        // Prevent self-role change
        if (targetUser.Id == currentUserId)
        {
            throw new ValidationException("You cannot change your own role");
        }

        // Admin restrictions
        if (currentUserRole == UserRole.Admin)
        {
            var tenantId = _tenantContext.TenantId!.Value;
            
            if (targetUser.TenantId != tenantId)
            {
                throw new UnauthorizedException("You can only change roles in your own tenant");
            }

            if (dto.NewRole == UserRole.SuperAdmin)
            {
                throw new UnauthorizedException("Admin cannot promote users to SuperAdmin");
            }

            if (targetUser.Role == UserRole.Admin || targetUser.Role == UserRole.SuperAdmin)
            {
                throw new UnauthorizedException("You cannot change role of Admin or SuperAdmin");
            }
        }

        // Update role
        targetUser.Role = dto.NewRole;
        targetUser.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToUserInfo(targetUser);
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private async Task<string> CreateRefreshTokenAsync(Guid userId, Guid tenantId, string? deviceInfo, string? ipAddress)
    {
        var refreshToken = _jwtService.GenerateRefreshToken();

        var tokenEntity = new RefreshToken
        {
            TenantId = tenantId,
            UserId = userId,
            Token = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenExpiryDays()),
            DeviceInfo = deviceInfo,
            IpAddress = ipAddress
        };

        _context.RefreshTokens.Add(tokenEntity);
        await _context.SaveChangesAsync();

        return refreshToken;
    }

    private UserInfoDto MapToUserInfo(User user)
    {
        return new UserInfoDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToRoleString(),
            IsVerified = user.IsVerified
        };
    }
}