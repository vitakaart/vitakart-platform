// File: apps/api/Controllers/CouponsController.cs

using api.API.RateLimiting;
using api.Application.DTOs;
using api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    // GET: api/coupons — Public list of active coupons
    [HttpGet]
    public async Task<ActionResult<List<CouponDto>>> GetActiveCoupons()
    {
        // Try to get user ID if authenticated (optional)
        Guid? userId = null;
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!string.IsNullOrEmpty(userIdClaim))
        {
            userId = Guid.Parse(userIdClaim);
        }

        var coupons = await _couponService.GetActiveCouponsAsync(userId);
        return Ok(coupons);
    }

    // GET: api/coupons/{code} — Get single coupon info
    [HttpGet("{code}")]
    public async Task<ActionResult<CouponDto>> GetCouponInfo(string code)
    {
        var coupon = await _couponService.GetCouponInfoAsync(code);
        if (coupon == null)
        {
            return NotFound(new { message = "Coupon not found or expired" });
        }
        return Ok(coupon);
    }

    // POST: api/coupons/validate — Validate without applying
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpPost("validate")]
    public async Task<ActionResult<CouponValidationDto>> ValidateCoupon(
        [FromBody] ApplyCouponDto dto,
        [FromQuery] decimal subtotal)
    {
        var userId = GetUserId();
        var result = await _couponService.ValidateCouponAsync(dto.Code, userId, subtotal);
        return Ok(result);
    }

    // POST: api/coupons/apply — Apply to cart
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpPost("apply")]
    public async Task<ActionResult<CartDto>> ApplyCoupon(ApplyCouponDto dto)
    {
        var userId = GetUserId();
        var cart = await _couponService.ApplyCouponToCartAsync(userId, dto.Code);
        return Ok(cart);
    }

    // DELETE: api/coupons/remove — Remove from cart
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpDelete("remove")]
    public async Task<ActionResult<CartDto>> RemoveCoupon()
    {
        var userId = GetUserId();
        var cart = await _couponService.RemoveCouponFromCartAsync(userId);
        return Ok(cart);
    }

    // ==========================================
    // HELPER
    // ==========================================
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("Invalid token");
        }

        return Guid.Parse(userIdClaim);
    }
}