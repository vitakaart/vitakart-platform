// File: apps/api/Infrastructure/Repositories/ReviewRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Get paginated reviews for a product
    public async Task<(List<Review> reviews, int totalCount)> GetProductReviewsAsync(
        Guid productId,
        int page,
        int pageSize,
        int? filterRating = null)
    {
        var query = Query()
            .Include(r => r.User)
            .Where(r => r.ProductId == productId);

        // Filter by rating if provided
        if (filterRating.HasValue && filterRating.Value >= 1 && filterRating.Value <= 5)
        {
            query = query.Where(r => r.Rating == filterRating.Value);
        }

        var totalCount = await query.CountAsync();

        var reviews = await query
            .OrderByDescending(r => r.IsVerifiedPurchase) // Verified first
            .ThenByDescending(r => r.CreatedAt)           // Then newest
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (reviews, totalCount);
    }

    // Get user's review for a specific product
    public async Task<Review?> GetUserReviewForProductAsync(Guid userId, Guid productId)
    {
        return await Query()
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId);
    }

    // Get all reviews by user
    public async Task<List<Review>> GetUserReviewsAsync(Guid userId)
    {
        return await Query()
            .Include(r => r.Product)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    // Check if user has delivered order for this product
    public async Task<bool> HasUserPurchasedProductAsync(Guid userId, Guid productId)
    {
        // Allow review for any successful order (not cancelled/refunded)
        var validStatuses = new[]
        {
        OrderStatus.Confirmed,
        OrderStatus.Processing,
        OrderStatus.Shipped,
        OrderStatus.Delivered
    };

        return await _context.Orders
            .Where(o => !o.IsDeleted)
            .Where(o => o.UserId == userId)
            .Where(o => validStatuses.Contains(o.Status))
            .AnyAsync(o => o.Items.Any(i => i.ProductId == productId));
    }

    // Get review stats — avg rating + count + breakdown
    public async Task<(decimal avgRating, int totalCount, Dictionary<int, int> ratingBreakdown)>
        GetProductReviewStatsAsync(Guid productId)
    {
        var reviews = await Query()
            .Where(r => r.ProductId == productId)
            .Select(r => r.Rating)
            .ToListAsync();

        var totalCount = reviews.Count;

        if (totalCount == 0)
        {
            return (0, 0, new Dictionary<int, int>
            {
                { 1, 0 }, { 2, 0 }, { 3, 0 }, { 4, 0 }, { 5, 0 }
            });
        }

        var avgRating = Math.Round((decimal)reviews.Average(), 2);

        var breakdown = new Dictionary<int, int>
        {
            { 1, reviews.Count(r => r == 1) },
            { 2, reviews.Count(r => r == 2) },
            { 3, reviews.Count(r => r == 3) },
            { 4, reviews.Count(r => r == 4) },
            { 5, reviews.Count(r => r == 5) },
        };

        return (avgRating, totalCount, breakdown);
    }

    // Check if review exists
    public async Task<bool> ReviewExistsAsync(Guid userId, Guid productId)
    {
        return await Query()
            .AnyAsync(r => r.UserId == userId && r.ProductId == productId);
    }
}