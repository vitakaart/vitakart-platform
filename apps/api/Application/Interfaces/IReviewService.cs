// File: apps/api/Application/Interfaces/IReviewService.cs

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IReviewService
{
    // Get paginated reviews for a product
    Task<PaginatedReviewsDto> GetProductReviewsAsync(Guid productId, ReviewQueryDto query);

    // Get review stats only (for product cards)
    Task<ProductReviewStatsDto> GetProductStatsAsync(Guid productId);

    // Check if user can review this product
    Task<ReviewEligibilityDto> CheckEligibilityAsync(Guid userId, Guid productId);

    // Get user's review for a product
    Task<ReviewDto?> GetUserReviewAsync(Guid userId, Guid productId);

    // Get all reviews by user
    Task<List<ReviewDto>> GetMyReviewsAsync(Guid userId);

    // Create new review
    Task<ReviewDto> CreateReviewAsync(Guid userId, CreateReviewDto dto);

    // Update review
    Task<ReviewDto> UpdateReviewAsync(Guid userId, Guid reviewId, UpdateReviewDto dto);

    // Delete review
    Task DeleteReviewAsync(Guid userId, Guid reviewId);
}