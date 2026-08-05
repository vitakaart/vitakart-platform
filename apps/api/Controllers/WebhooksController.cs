// File: apps/api/Controllers/WebhooksController.cs
// Webhook endpoints for external services (Razorpay, etc.)
// NO AUTHENTICATION — signature verification provides security

using api.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController]
[Route("api/webhooks")]
public class WebhooksController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ILogger<WebhooksController> _logger;

    public WebhooksController(
        IPaymentService paymentService,
        ILogger<WebhooksController> logger)
    {
        _paymentService = paymentService;
        _logger = logger;
    }

    /// <summary>
    /// Razorpay webhook endpoint.
    /// Receives events: payment.captured, payment.failed, refund.created, refund.processed
    /// Security: HMAC signature verification via X-Razorpay-Signature header
    /// </summary>
    [HttpPost("razorpay")]
    public async Task<IActionResult> RazorpayWebhook()
    {
        try
        {
            // Read raw request body (needed for signature verification)
            using var reader = new StreamReader(Request.Body);
            var requestBody = await reader.ReadToEndAsync();

            // Get signature from headers
            var signature = Request.Headers["X-Razorpay-Signature"].ToString();

            if (string.IsNullOrEmpty(signature))
            {
                _logger.LogWarning("Webhook received without signature");
                return BadRequest(new { success = false, message = "Missing signature" });
            }

            // Process webhook
            var success = await _paymentService.HandleWebhookAsync(requestBody, signature);

            if (!success)
            {
                return BadRequest(new { success = false, message = "Webhook processing failed" });
            }

            // Always return 200 to Razorpay to prevent retries
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Webhook error");
            // Still return 200 to prevent Razorpay retries for our internal errors
            return Ok(new { success = false });
        }
    }
}