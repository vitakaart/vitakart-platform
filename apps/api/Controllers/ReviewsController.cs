// File: apps/api/Controllers/ReviewsController.cs

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
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // GET: api/reviews/product/{productId} — Public (no auth)
    [HttpGet("product/{productId:guid}")]
    public async Task<ActionResult<PaginatedReviewsDto>> GetProductReviews(
        Guid productId,
        [FromQuery] ReviewQueryDto query)
    {
        var reviews = await _reviewService.GetProductReviewsAsync(productId, query);
        return Ok(reviews);
    }

    // GET: api/reviews/product/{productId}/stats — Public
    [HttpGet("product/{productId:guid}/stats")]
    public async Task<ActionResult<ProductReviewStatsDto>> GetProductStats(Guid productId)
    {
        var stats = await _reviewService.GetProductStatsAsync(productId);
        return Ok(stats);
    }

    // GET: api/reviews/product/{productId}/eligibility — Auth required
    [Authorize]
    [HttpGet("product/{productId:guid}/eligibility")]
    public async Task<ActionResult<ReviewEligibilityDto>> CheckEligibility(Guid productId)
    {
        var userId = GetUserId();
        var eligibility = await _reviewService.CheckEligibilityAsync(userId, productId);
        return Ok(eligibility);
    }

    // GET: api/reviews/product/{productId}/my-review — Auth required
    [Authorize]
    [HttpGet("product/{productId:guid}/my-review")]
    public async Task<ActionResult<ReviewDto>> GetMyReviewForProduct(Guid productId)
    {
        var userId = GetUserId();
        var review = await _reviewService.GetUserReviewAsync(userId, productId);

        if (review == null)
        {
            return NotFound(new { message = "You have not reviewed this product" });
        }

        return Ok(review);
    }

    // GET: api/reviews/my-reviews — All my reviews
    [Authorize]
    [HttpGet("my-reviews")]
    public async Task<ActionResult<List<ReviewDto>>> GetMyReviews()
    {
        var userId = GetUserId();
        var reviews = await _reviewService.GetMyReviewsAsync(userId);
        return Ok(reviews);
    }

    // POST: api/reviews — Create new review
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto dto)
    {
        var userId = GetUserId();
        var review = await _reviewService.CreateReviewAsync(userId, dto);
        return CreatedAtAction(
            nameof(GetMyReviewForProduct),
            new { productId = review.ProductId },
            review);
    }

    // PUT: api/reviews/{id} — Update
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ReviewDto>> UpdateReview(Guid id, UpdateReviewDto dto)
    {
        var userId = GetUserId();
        var review = await _reviewService.UpdateReviewAsync(userId, id, dto);
        return Ok(review);
    }

    // DELETE: api/reviews/{id} — Delete
    [EnableRateLimiting(RateLimitPolicies.Write)]
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteReview(Guid id)
    {
        var userId = GetUserId();
        await _reviewService.DeleteReviewAsync(userId, id);
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