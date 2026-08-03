// File: apps/api/Controllers/PaymentsController.cs

using api.API.RateLimiting;
using api.Application.DTOs.Payment;
using api.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
[EnableRateLimiting(RateLimitPolicies.Write)]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost("create-order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreatePaymentOrderRequest request)
    {
        var userId = GetUserId();
        var response = await _paymentService.CreateRazorpayOrderAsync(userId, request);
        return Ok(new { success = true, data = response });
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        var userId = GetUserId();
        var response = await _paymentService.VerifyPaymentAsync(userId, request);
        return Ok(new { success = true, data = response });
    }

    [HttpPost("failure")]
    public async Task<IActionResult> ReportFailure([FromBody] PaymentFailureRequest request)
    {
        var userId = GetUserId();
        await _paymentService.HandlePaymentFailureAsync(userId, request);
        return Ok(new { success = true, message = "Failure recorded" });
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst("sub")?.Value
            ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? throw new UnauthorizedAccessException("User ID not found");

        return Guid.Parse(userIdClaim);
    }
}