// File: apps/api/Application/Services/AuthService.cs
// Complete file with account lockout + brute force protection
// All methods included — safe to fully replace

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Domain.Exceptions;
using api.Infrastructure.Extensions;


namespace api.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtService _jwtService;
    private readonly ITenantContext _tenantContext;
    private readonly IEmailService _emailService;

    // ==========================================
    // ACCOUNT LOCKOUT CONFIG (from .env)
    // ==========================================
    private static int MaxFailedAttempts =>
        int.Parse(Environment.GetEnvironmentVariable("LOCKOUT_MAX_FAILED_ATTEMPTS") ?? "5");

    private static int LockoutDurationMinutes =>
        int.Parse(Environment.GetEnvironmentVariable("LOCKOUT_DURATION_MINUTES") ?? "15");

    public AuthService(
        IUnitOfWork unitOfWork,
        IJwtService jwtService,
        ITenantContext tenantContext,
        IEmailService emailService)

    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
        _tenantContext = tenantContext;
        _emailService = emailService;
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

        // Check email uniqueness
        var emailExists = await _unitOfWork.Users.EmailExistsAsync(dto.Email, tenantId);
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

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, tenantId, deviceInfo, ipAddress);

        // Send welcome email (fire and forget — don't block registration)
        _ = Task.Run(async () =>
        {
            try
            {
                await _emailService.SendWelcomeEmailAsync(user.Email, user.FullName);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Welcome email failed: {ex.Message}");
            }
        });

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = MapToUserInfo(user)
        };
    }

    // ==========================================
    // LOGIN (with account lockout)
    // ==========================================
    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, string? deviceInfo, string? ipAddress)
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        var user = await _unitOfWork.Users.GetByEmailAndTenantAsync(dto.Email, tenantId);

        if (user == null)
        {
            throw new UnauthorizedException("Invalid email or password");
        }

        // ==========================================
        // ACCOUNT LOCKOUT CHECK
        // ==========================================
        if (user.IsLocked)
        {
            var minutesLeft = (int)Math.Ceiling((user.LockedUntil!.Value - DateTime.UtcNow).TotalMinutes);
            throw new UnauthorizedException(
                $"Account locked due to too many failed attempts. Try again in {minutesLeft} minute(s).");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedException("Account is deactivated");
        }

        // ==========================================
        // PASSWORD VERIFICATION
        // ==========================================
        var passwordValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!passwordValid)
        {
            // Increment failed attempts
            user.FailedLoginAttempts++;

            // Lock account if threshold reached
            if (user.FailedLoginAttempts >= MaxFailedAttempts)
            {
                user.LockedUntil = DateTime.UtcNow.AddMinutes(LockoutDurationMinutes);
                _unitOfWork.Users.Update(user);
                await _unitOfWork.SaveChangesAsync();

                throw new UnauthorizedException(
                    $"Account locked due to {MaxFailedAttempts} failed attempts. " +
                    $"Try again in {LockoutDurationMinutes} minutes.");
            }

            _unitOfWork.Users.Update(user);
            await _unitOfWork.SaveChangesAsync();

            var attemptsLeft = MaxFailedAttempts - user.FailedLoginAttempts;
            throw new UnauthorizedException(
                $"Invalid email or password. {attemptsLeft} attempt(s) remaining before lockout.");
        }



        // ==========================================
        // SUCCESSFUL LOGIN — Reset counters
        // ==========================================
        user.FailedLoginAttempts = 0;
        user.LockedUntil = null;
        user.LastLoginAt = DateTime.UtcNow;
        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

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
    // GET CURRENT USER
    // ==========================================
    public async Task<UserInfoDto> GetCurrentUserAsync(Guid userId)
    {
        var user = await _unitOfWork.Users.GetFirstAsync(u => u.Id == userId && u.IsActive);

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

        var existingToken = await _unitOfWork.RefreshTokens.GetByTokenWithUserAsync(refreshToken);

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
        _unitOfWork.RefreshTokens.Update(existingToken);

        var newTokenEntity = new RefreshToken
        {
            TenantId = existingToken.TenantId,
            UserId = existingToken.UserId,
            Token = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddDays(_jwtService.GetRefreshTokenExpiryDays()),
            DeviceInfo = deviceInfo,
            IpAddress = ipAddress
        };

        await _unitOfWork.RefreshTokens.AddAsync(newTokenEntity);
        await _unitOfWork.SaveChangesAsync();

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

        var token = await _unitOfWork.RefreshTokens.GetByTokenAsync(refreshToken);

        if (token == null)
        {
            return; // Silent fail
        }

        if (token.IsActive)
        {
            token.RevokedAt = DateTime.UtcNow;
            _unitOfWork.RefreshTokens.Update(token);
            await _unitOfWork.SaveChangesAsync();
        }
    }

    // ==========================================
    // CHANGE USER ROLE
    // ==========================================
    public async Task<UserInfoDto> ChangeUserRoleAsync(Guid currentUserId, UserRole currentUserRole, ChangeRoleDto dto)
    {
        if (currentUserRole != UserRole.SuperAdmin && currentUserRole != UserRole.Admin)
        {
            throw new UnauthorizedException("Only Admin or SuperAdmin can change roles");
        }

        // SuperAdmin can search across tenants — use unfiltered
        User? targetUser;
        if (currentUserRole == UserRole.SuperAdmin)
        {
            targetUser = await _unitOfWork.Users
                .QueryUnfiltered()
                .Where(u => !u.IsDeleted)
                .FirstOrDefaultAsyncSafe(u => u.Id == dto.UserId);
        }
        else
        {
            targetUser = await _unitOfWork.Users.GetByIdAsync(dto.UserId);
        }

        if (targetUser == null)
        {
            throw new NotFoundException("User not found");
        }

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

        targetUser.Role = dto.NewRole;
        _unitOfWork.Users.Update(targetUser);
        await _unitOfWork.SaveChangesAsync();

        return MapToUserInfo(targetUser);
    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================
    public async Task<ProfileUpdatedDto> UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        var user = await _unitOfWork.Users.GetFirstAsync(u =>
            u.Id == userId && u.IsActive);

        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        // Update fields
        user.FullName = dto.FullName.Trim();
        user.Phone = dto.Phone?.Trim();
        user.ProfileImage = dto.ProfileImage;

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return new ProfileUpdatedDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            ProfileImage = user.ProfileImage,
            Role = user.Role.ToRoleString(),
            IsVerified = user.IsVerified
        };
    }



    // ==========================================
    // FORGOT PASSWORD
    // ==========================================
    public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(string email, string? ipAddress)
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }

        var tenantId = _tenantContext.TenantId!.Value;

        var user = await _unitOfWork.Users.GetByEmailAndTenantAsync(email, tenantId);

        // Security: Don't reveal if email exists or not
        // Always return same success message
        var response = new ForgotPasswordResponseDto
        {
            Message = "If an account with this email exists, you will receive a password reset link shortly."
        };

        if (user == null || !user.IsActive)
        {
            // Silent fail — don't leak info
            return response;
        }

        // Invalidate previous unused tokens
        await _unitOfWork.PasswordResetTokens.InvalidateUserTokensAsync(user.Id);

        // Generate secure token
        var token = GenerateResetToken();

        // Save token (15 min expiry)
        var resetToken = new PasswordResetToken
        {
            TenantId = tenantId,
            UserId = user.Id,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddMinutes(15),
            IpAddress = ipAddress
        };

        await _unitOfWork.PasswordResetTokens.AddAsync(resetToken);
        await _unitOfWork.SaveChangesAsync();

        // ==========================================
        // DEV MODE: Return token in response + log
        // TODO: Replace with real email in production
        // ==========================================
        var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL")
                       ?? "http://localhost:3000";
        var resetUrl = $"{frontendUrl}/reset-password?token={token}";

        // Console log for developer (dev debugging)
        Console.WriteLine("");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine("🔐 PASSWORD RESET REQUEST");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine($"👤 User: {user.Email}");
        Console.WriteLine($"🔑 Token: {token}");
        Console.WriteLine($"🔗 Reset URL: {resetUrl}");
        Console.WriteLine($"⏰ Expires: {resetToken.ExpiresAt:g} (15 min)");
        Console.WriteLine("═══════════════════════════════════════════════════════");
        Console.WriteLine("");

        // Send actual email
        var emailSent = await _emailService.SendPasswordResetEmailAsync(
            user.Email,
            user.FullName,
            resetUrl);

        if (emailSent)
        {
            Console.WriteLine($"✅ Password reset email sent to {user.Email}");
        }
        else
        {
            Console.WriteLine($"⚠️  Email failed — falling back to dev mode (token in response)");
            // Fallback: include token in response if email fails
            response.ResetToken = token;
            response.ResetUrl = resetUrl;
        }

        return response;
    }

    // ==========================================
    // RESET PASSWORD
    // ==========================================
    public async Task ResetPasswordAsync(string token, string newPassword)
    {
        if (string.IsNullOrEmpty(token))
        {
            throw new ValidationException("Reset token is required");
        }

        // Validate password strength (same as register)
        if (newPassword.Length < 8)
        {
            throw new ValidationException("Password must be at least 8 characters");
        }

        // Find token
        var resetToken = await _unitOfWork.PasswordResetTokens.GetByTokenAsync(token);

        if (resetToken == null)
        {
            throw new ValidationException("Invalid reset token");
        }

        if (resetToken.IsUsed)
        {
            throw new ValidationException("This reset link has already been used");
        }

        if (resetToken.ExpiresAt <= DateTime.UtcNow)
        {
            throw new ValidationException("This reset link has expired. Please request a new one.");
        }

        if (resetToken.User == null || !resetToken.User.IsActive || resetToken.User.IsDeleted)
        {
            throw new ValidationException("User account not found or inactive");
        }

        // Update password
        resetToken.User.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        resetToken.User.FailedLoginAttempts = 0;  // Reset lockout
        resetToken.User.LockedUntil = null;

        // Mark token as used
        resetToken.IsUsed = true;
        resetToken.UsedAt = DateTime.UtcNow;

        _unitOfWork.Users.Update(resetToken.User);
        _unitOfWork.PasswordResetTokens.Update(resetToken);
        await _unitOfWork.SaveChangesAsync();

        // Log for security
        Console.WriteLine($"✅ Password reset successful for user: {resetToken.User.Email}");
    }

    // ==========================================
    // PRIVATE HELPER — Generate secure token
    // ==========================================
    private static string GenerateResetToken()
    {
        // 64 chars alphanumeric — cryptographically secure
        var bytes = new byte[48];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
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

        await _unitOfWork.RefreshTokens.AddAsync(tokenEntity);
        await _unitOfWork.SaveChangesAsync();

        return refreshToken;
    }

    private UserInfoDto MapToUserInfo(User user)
    {
        return new UserInfoDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            ProfileImage = user.ProfileImage,
            Role = user.Role.ToRoleString(),
            IsVerified = user.IsVerified
        };
    }
}

