// File: apps/api/Controllers/CartController.cs
// Cart management endpoints — all require authentication

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
[Authorize] // All endpoints require login
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    // GET: api/cart — Get user's cart
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart()
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.GetCartAsync(userId);
        return Ok(cart);
    }

    // POST: api/cart/items — Add item to cart
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost("items")]
    public async Task<ActionResult<CartDto>> AddItem(AddToCartDto dto)
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.AddToCartAsync(userId, dto);
        return Ok(cart);
    }

    // PUT: api/cart/items/{itemId} — Update quantity
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPut("items/{itemId:guid}")]
    public async Task<ActionResult<CartDto>> UpdateItem(Guid itemId, UpdateCartItemDto dto)
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.UpdateCartItemAsync(userId, itemId, dto);
        return Ok(cart);
    }

    // DELETE: api/cart/items/{itemId} — Remove item
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete("items/{itemId:guid}")]
    public async Task<ActionResult<CartDto>> RemoveItem(Guid itemId)
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.RemoveCartItemAsync(userId, itemId);
        return Ok(cart);
    }

    // DELETE: api/cart — Clear entire cart
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpDelete]
    public async Task<ActionResult<CartDto>> ClearCart()
    {
        var userId = GetCurrentUserId();
        var cart = await _cartService.ClearCartAsync(userId);
        return Ok(cart);
    }

    // ==========================================
    // PRIVATE HELPER
    // ==========================================
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
                       ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token");
        }

        return userId;
    }
}