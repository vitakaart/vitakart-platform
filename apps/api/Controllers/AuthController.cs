// File: apps/api/Controllers/AuthController.cs
// Updated with strict rate limiting on auth endpoints

using api.API.Attributes;
using api.API.RateLimiting;
using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/register — STRICT rate limit (5 per minute)
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        var deviceInfo = Request.Headers.UserAgent.ToString();
        var ipAddress = GetClientIp();

        var result = await _authService.RegisterAsync(dto, deviceInfo, ipAddress);
        return Ok(result);
    }

    // POST: api/auth/login — STRICT rate limit (anti brute-force)
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var deviceInfo = Request.Headers.UserAgent.ToString();
        var ipAddress = GetClientIp();

        var result = await _authService.LoginAsync(dto, deviceInfo, ipAddress);
        return Ok(result);
    }

    // POST: api/auth/refresh — STRICT rate limit
    [EnableRateLimiting(RateLimitPolicies.Auth)]
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponseDto>> RefreshToken(RefreshTokenRequestDto dto)
    {
        var deviceInfo = Request.Headers.UserAgent.ToString();
        var ipAddress = GetClientIp();

        var result = await _authService.RefreshTokenAsync(dto.RefreshToken, deviceInfo, ipAddress);
        return Ok(result);
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    public async Task<ActionResult> Logout(LogoutRequestDto dto)
    {
        await _authService.LogoutAsync(dto.RefreshToken);
        return Ok(new { message = "Logged out successfully" });
    }

    // GET: api/auth/me
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserInfoDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var userId = Guid.Parse(userIdClaim);
        var user = await _authService.GetCurrentUserAsync(userId);
        return Ok(user);
    }


    // PUT: api/auth/profile
    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<ProfileUpdatedDto>> UpdateProfile(UpdateProfileDto dto)
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var userId = Guid.Parse(userIdClaim);
        var result = await _authService.UpdateProfileAsync(userId, dto);
        return Ok(result);
    }

    // POST: api/auth/change-role — WRITE rate limit
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [RequireRole(UserRole.Admin)]
    [HttpPost("change-role")]
    public async Task<ActionResult<UserInfoDto>> ChangeRole(ChangeRoleDto dto)
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var roleClaim = User.FindFirst("role")?.Value
                     ?? User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || string.IsNullOrEmpty(roleClaim))
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var currentUserId = Guid.Parse(userIdClaim);
        var currentRole = UserRoleExtensions.ParseRole(roleClaim);

        var user = await _authService.ChangeUserRoleAsync(currentUserId, currentRole, dto);
        return Ok(user);
    }

    private string? GetClientIp()
    {
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}