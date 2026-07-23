// File: apps/api/Application/Interfaces/IReviewRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IReviewRepository : IRepository<Review>
{
    // Get all reviews for a product with pagination
    Task<(List<Review> reviews, int totalCount)> GetProductReviewsAsync(
        Guid productId,
        int page,
        int pageSize,
        int? filterRating = null);

    // Get single user's review for a product
    Task<Review?> GetUserReviewForProductAsync(Guid userId, Guid productId);

    // Get all reviews by a user
    Task<List<Review>> GetUserReviewsAsync(Guid userId);

    // Check if user has purchased this product (delivered order)
    Task<bool> HasUserPurchasedProductAsync(Guid userId, Guid productId);

    // Get review stats for a product
    Task<(decimal avgRating, int totalCount, Dictionary<int, int> ratingBreakdown)>
        GetProductReviewStatsAsync(Guid productId);

    // Check if review exists
    Task<bool> ReviewExistsAsync(Guid userId, Guid productId);
}