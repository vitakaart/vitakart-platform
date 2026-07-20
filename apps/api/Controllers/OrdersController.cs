// File: apps/api/Controllers/OrdersController.cs
// Order endpoints — all require authentication
// Follows same pattern as CartController

using api.API.RateLimiting;
using api.Application.DTOs.Order;
using api.Application.Interfaces;
using api.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // All endpoints require login
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // ==========================================
    // POST: api/orders — Create order (checkout)
    // ==========================================
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderDto dto)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.CreateOrderAsync(userId, dto);

        // Return 201 Created with location header
        return CreatedAtAction(
            nameof(GetOrderById),
            new { orderId = order.Id },
            order
        );
    }

    // ==========================================
    // GET: api/orders — Get user's orders (paginated + filter)
    // ==========================================
    [HttpGet]
    public async Task<ActionResult<PaginatedOrdersDto>> GetMyOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] OrderStatus? status = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null)
    {
        var userId = GetCurrentUserId();
        var orders = await _orderService.GetUserOrdersAsync(
            userId, page, pageSize, status, fromDate, toDate);
        return Ok(orders);
    }
    // ==========================================
    // GET: api/orders/{orderId} — Get single order
    // ==========================================
    [HttpGet("{orderId:guid}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(Guid orderId)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.GetOrderByIdAsync(userId, orderId);
        return Ok(order);
    }

    // ==========================================
    // GET: api/orders/number/{orderNumber} — Get by order number
    // ==========================================
    [HttpGet("number/{orderNumber}")]
    public async Task<ActionResult<OrderDto>> GetOrderByNumber(string orderNumber)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.GetOrderByNumberAsync(userId, orderNumber);
        return Ok(order);
    }

    // ==========================================
    // POST: api/orders/{orderId}/cancel — Cancel order
    // ==========================================
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [HttpPost("{orderId:guid}/cancel")]
    public async Task<ActionResult<OrderDto>> CancelOrder(
        Guid orderId,
        [FromBody] CancelOrderDto? dto = null)
    {
        var userId = GetCurrentUserId();
        var order = await _orderService.CancelOrderAsync(userId, orderId, dto?.Reason);
        return Ok(order);
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