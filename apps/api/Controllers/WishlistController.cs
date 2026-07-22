// File: apps/api/Controllers/WishlistController.cs

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
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    // GET: api/wishlist — Get all wishlist items
    [HttpGet]
    public async Task<ActionResult<List<WishlistItemDto>>> GetMyWishlist()
    {
        var userId = GetUserId();
        var wishlist = await _wishlistService.GetUserWishlistAsync(userId);
        return Ok(wishlist);
    }

    // GET: api/wishlist/count — Get wishlist count only
    [HttpGet("count")]
    public async Task<ActionResult<WishlistCountDto>> GetWishlistCount()
    {
        var userId = GetUserId();
        var count = await _wishlistService.GetWishlistCountAsync(userId);
        return Ok(new WishlistCountDto { Count = count });
    }

    // GET: api/wishlist/product-ids — Get all product IDs (for bulk check)
    [HttpGet("product-ids")]
    public async Task<ActionResult<List<Guid>>> GetWishlistProductIds()
    {
        var userId = GetUserId();
        var ids = await _wishlistService.GetWishlistProductIdsAsync(userId);
        return Ok(ids);
    }

    // GET: api/wishlist/check/{productId} — Check if in wishlist
    [HttpGet("check/{productId:guid}")]
    public async Task<ActionResult<bool>> CheckInWishlist(Guid productId)
    {
        var userId = GetUserId();
        var isInWishlist = await _wishlistService.IsInWishlistAsync(userId, productId);
        return Ok(isInWishlist);
    }

    // POST: api/wishlist/toggle — Toggle product (add/remove)
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost("toggle")]
    public async Task<ActionResult<WishlistToggleDto>> ToggleWishlist(WishlistActionDto dto)
    {
        var userId = GetUserId();
        var result = await _wishlistService.ToggleWishlistAsync(userId, dto.ProductId);
        return Ok(result);
    }

    // POST: api/wishlist — Add product to wishlist
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost]
    public async Task<ActionResult<WishlistToggleDto>> AddToWishlist(WishlistActionDto dto)
    {
        var userId = GetUserId();
        var result = await _wishlistService.AddToWishlistAsync(userId, dto.ProductId);
        return Ok(result);
    }

    // DELETE: api/wishlist/{productId} — Remove from wishlist
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete("{productId:guid}")]
    public async Task<ActionResult<WishlistToggleDto>> RemoveFromWishlist(Guid productId)
    {
        var userId = GetUserId();
        var result = await _wishlistService.RemoveFromWishlistAsync(userId, productId);
        return Ok(result);
    }

    // DELETE: api/wishlist — Clear entire wishlist
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete]
    public async Task<ActionResult> ClearWishlist()
    {
        var userId = GetUserId();
        await _wishlistService.ClearWishlistAsync(userId);
        return NoContent();
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