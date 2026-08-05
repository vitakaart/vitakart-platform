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
    // REFRESH TOKEN (with THEFT DETECTION)
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

        // ==========================================
        // 🚨 THEFT DETECTION
        // If REVOKED token is being reused = someone stole it!
        // Revoke ALL user's tokens for safety
        // ==========================================
        if (existingToken.RevokedAt != null)
        {
            // Log security incident
            Console.WriteLine("");
            Console.WriteLine("═══════════════════════════════════════════════════════");
            Console.WriteLine("🚨 SECURITY ALERT: TOKEN THEFT DETECTED!");
            Console.WriteLine("═══════════════════════════════════════════════════════");
            Console.WriteLine($"👤 User ID: {existingToken.UserId}");
            Console.WriteLine($"📧 Email: {existingToken.User?.Email ?? "unknown"}");
            Console.WriteLine($"🔑 Reused Token: {refreshToken.Substring(0, Math.Min(20, refreshToken.Length))}...");
            Console.WriteLine($"📍 IP Address: {ipAddress ?? "unknown"}");
            Console.WriteLine($"💻 Device: {deviceInfo ?? "unknown"}");
            Console.WriteLine($"⏰ Original Revoked: {existingToken.RevokedAt:g}");
            Console.WriteLine($"🔒 Action: Revoking ALL user sessions");
            Console.WriteLine("═══════════════════════════════════════════════════════");
            Console.WriteLine("");

            // Revoke ALL active tokens for this user
            var revokedCount = await _unitOfWork.RefreshTokens.RevokeAllUserTokensAsync(
                existingToken.UserId,
                $"THEFT_DETECTED_{DateTime.UtcNow:yyyyMMddHHmmss}"
            );

            await _unitOfWork.SaveChangesAsync();

            Console.WriteLine($"🛡️ Revoked {revokedCount} active sessions for user safety");

            // Send security alert email (background)
            if (existingToken.User != null)
            {
                var userEmail = existingToken.User.Email;
                var userName = existingToken.User.FullName;
                var alertIp = ipAddress ?? "Unknown";
                var alertDevice = deviceInfo ?? "Unknown device";
                var alertTime = DateTime.UtcNow.ToString("dddd, MMMM dd, yyyy 'at' hh:mm tt UTC");

                _ = Task.Run(async () =>
                {
                    try
                    {
                        var subject = "🚨 Security Alert - Unusual Activity Detected on Your Account";

                        var htmlBody = $@"
                        <!DOCTYPE html>
                        <html>
                        <head><meta charset='utf-8'></head>
                        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                            <div style='background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; border-radius: 12px; text-align: center;'>
                                <h1 style='margin: 0; font-size: 24px;'>🚨 Security Alert</h1>
                                <p style='margin: 10px 0 0 0; opacity: 0.95;'>Unusual activity detected on your account</p>
                            </div>
                            
                            <div style='background: #FEFBF3; padding: 30px; border-radius: 12px; margin-top: 20px;'>
                                <h2 style='color: #0A0A0A; margin-top: 0;'>Hello {userName},</h2>
                                
                                <p style='color: #4A4A4A; line-height: 1.6;'>
                                    We detected unusual activity on your Vitakart account and have logged you out from all devices as a security precaution.
                                </p>
                                
                                <div style='background: white; border: 2px solid #E9E1D2; border-radius: 8px; padding: 20px; margin: 20px 0;'>
                                    <h3 style='color: #EF4444; margin-top: 0;'>🔍 Activity Details:</h3>
                                    <table style='width: 100%; border-collapse: collapse;'>
                                        <tr>
                                            <td style='padding: 8px 0; color: #6B665D;'><strong>⏰ Time:</strong></td>
                                            <td style='padding: 8px 0; color: #0A0A0A;'>{alertTime}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; color: #6B665D;'><strong>📍 IP Address:</strong></td>
                                            <td style='padding: 8px 0; color: #0A0A0A;'>{alertIp}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 8px 0; color: #6B665D;'><strong>💻 Device:</strong></td>
                                            <td style='padding: 8px 0; color: #0A0A0A;'>{alertDevice}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <div style='background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px; margin: 20px 0;'>
                                    <h3 style='color: #92400E; margin-top: 0;'>⚡ What to do now:</h3>
                                    <ol style='color: #78350F; line-height: 1.8;'>
                                        <li>Log in again with your password</li>
                                        <li><strong>Change your password immediately</strong></li>
                                        <li>Review your recent orders and account activity</li>
                                        <li>If this wasn't you, contact our support team</li>
                                    </ol>
                                </div>
                                
                                <p style='color: #6B665D; font-size: 14px; margin-top: 30px;'>
                                    If you recognize this activity, no further action is needed. However, we still recommend changing your password for extra security.
                                </p>
                                
                                <div style='border-top: 1px solid #E9E1D2; margin-top: 30px; padding-top: 20px; text-align: center;'>
                                    <p style='color: #6B665D; font-size: 12px;'>
                                        Stay safe,<br>
                                        <strong style='color: #10B981;'>Vitakart Security Team</strong>
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ";

                        var plainText = $@"
Security Alert - Unusual Activity Detected

Hello {userName},

We detected unusual activity on your Vitakart account and have logged you out from all devices as a security precaution.

Activity Details:
- Time: {alertTime}
- IP Address: {alertIp}
- Device: {alertDevice}

What to do now:
1. Log in again with your password
2. Change your password immediately
3. Review your recent orders
4. If this wasn't you, contact support

Stay safe,
Vitakart Security Team
                    ";

                        await _emailService.SendEmailAsync(
                            userEmail,
                            userName,
                            subject,
                            htmlBody,
                            plainText
                        );

                        Console.WriteLine($"✅ Security alert email sent to {userEmail}");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Security alert email failed: {ex.Message}");
                    }
                });
            }

            throw new UnauthorizedException(
                "Security alert: This session has been terminated due to unusual activity. Please login again."
            );
        }

        // ==========================================
        // NORMAL FLOW (Token is active)
        // ==========================================
        if (existingToken.IsExpired)
        {
            throw new UnauthorizedException("Refresh token expired. Please login again.");
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

