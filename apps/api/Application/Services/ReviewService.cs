// File: apps/api/Application/Services/ReviewService.cs
// Review business logic with auto-rating update

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    public ReviewService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // ==========================================
    // GET PRODUCT REVIEWS (with stats + pagination)
    // ==========================================
    public async Task<PaginatedReviewsDto> GetProductReviewsAsync(Guid productId, ReviewQueryDto query)
    {
        // Validate product exists
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Normalize pagination
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize < 1 ? 10 : Math.Min(query.PageSize, 50);

        // Get reviews
        var (reviews, totalCount) = await _unitOfWork.Reviews.GetProductReviewsAsync(
            productId, page, pageSize, query.Rating);

        // Get stats
        var stats = await GetProductStatsAsync(productId);

        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginatedReviewsDto
        {
            Reviews = reviews.Select(MapToDto).ToList(),
            Stats = stats,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = totalPages,
            HasNextPage = page < totalPages,
            HasPreviousPage = page > 1
        };
    }

    // ==========================================
    // GET PRODUCT STATS (breakdown)
    // ==========================================
    public async Task<ProductReviewStatsDto> GetProductStatsAsync(Guid productId)
    {
        var (avgRating, totalCount, breakdown) =
            await _unitOfWork.Reviews.GetProductReviewStatsAsync(productId);

        // Calculate percentages
        var percentage = new Dictionary<int, decimal>();
        foreach (var kvp in breakdown)
        {
            percentage[kvp.Key] = totalCount > 0
                ? Math.Round((decimal)kvp.Value / totalCount * 100, 1)
                : 0;
        }

        return new ProductReviewStatsDto
        {
            AverageRating = avgRating,
            TotalReviews = totalCount,
            RatingBreakdown = breakdown,
            RatingPercentage = percentage
        };
    }

    // ==========================================
    // CHECK ELIGIBILITY
    // ==========================================
    public async Task<ReviewEligibilityDto> CheckEligibilityAsync(Guid userId, Guid productId)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Check existing review
        var existingReview = await _unitOfWork.Reviews.GetUserReviewForProductAsync(userId, productId);

        // Check purchase
        var hasPurchased = await _unitOfWork.Reviews.HasUserPurchasedProductAsync(userId, productId);

        var result = new ReviewEligibilityDto
        {
            HasReviewed = existingReview != null,
            HasPurchased = hasPurchased,
            ExistingReview = existingReview != null ? MapToDto(existingReview) : null
        };

        // Determine if user can review
        if (existingReview != null)
        {
            result.CanReview = false;
            result.Reason = "You have already reviewed this product";
        }
        else if (!hasPurchased)
        {
            result.CanReview = false;
            result.Reason = "You can only review products you have purchased";
        }
        else
        {
            result.CanReview = true;
            result.Reason = null;
        }

        return result;
    }

    // ==========================================
    // GET USER'S REVIEW FOR PRODUCT
    // ==========================================
    public async Task<ReviewDto?> GetUserReviewAsync(Guid userId, Guid productId)
    {
        var review = await _unitOfWork.Reviews.GetUserReviewForProductAsync(userId, productId);
        return review == null ? null : MapToDto(review);
    }

    // ==========================================
    // GET ALL USER REVIEWS
    // ==========================================
    public async Task<List<ReviewDto>> GetMyReviewsAsync(Guid userId)
    {
        var reviews = await _unitOfWork.Reviews.GetUserReviewsAsync(userId);
        return reviews.Select(MapToDto).ToList();
    }

    // ==========================================
    // CREATE REVIEW
    // ==========================================
    public async Task<ReviewDto> CreateReviewAsync(Guid userId, CreateReviewDto dto)
    {
        ValidateTenant();

        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new ValidationException("Rating must be between 1 and 5");
        }

        // Check product exists
        var product = await _unitOfWork.Products.GetByIdAsync(dto.ProductId);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Check duplicate
        var alreadyReviewed = await _unitOfWork.Reviews.ReviewExistsAsync(userId, dto.ProductId);
        if (alreadyReviewed)
        {
            throw new ValidationException("You have already reviewed this product");
        }

        // Check verified purchase
        var hasPurchased = await _unitOfWork.Reviews.HasUserPurchasedProductAsync(userId, dto.ProductId);
        if (!hasPurchased)
        {
            throw new ValidationException("You can only review products you have purchased and received");
        }

        // Begin transaction
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // Create review
            var review = new Review
            {
                TenantId = _tenantContext.TenantId!.Value,
                UserId = userId,
                ProductId = dto.ProductId,
                Rating = dto.Rating,
                Title = string.IsNullOrWhiteSpace(dto.Title) ? null : dto.Title.Trim(),
                Comment = dto.Comment.Trim(),
                IsVerifiedPurchase = hasPurchased
            };

            await _unitOfWork.Reviews.AddAsync(review);
            await _unitOfWork.SaveChangesAsync();

            // Update product's rating aggregates
            await UpdateProductRatingAsync(dto.ProductId);

            await _unitOfWork.CommitTransactionAsync();

            // Fetch with user info
            var createdReview = await _unitOfWork.Reviews.GetUserReviewForProductAsync(userId, dto.ProductId);
            return MapToDto(createdReview!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // UPDATE REVIEW
    // ==========================================
    public async Task<ReviewDto> UpdateReviewAsync(Guid userId, Guid reviewId, UpdateReviewDto dto)
    {
        // Validate rating
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new ValidationException("Rating must be between 1 and 5");
        }

        var review = await _unitOfWork.Reviews.GetByIdAsync(reviewId);
        if (review == null)
        {
            throw new NotFoundException("Review not found");
        }

        // Ownership check
        if (review.UserId != userId)
        {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // Update fields
            review.Rating = dto.Rating;
            review.Title = string.IsNullOrWhiteSpace(dto.Title) ? null : dto.Title.Trim();
            review.Comment = dto.Comment.Trim();

            _unitOfWork.Reviews.Update(review);
            await _unitOfWork.SaveChangesAsync();

            // Update product's rating aggregates
            await UpdateProductRatingAsync(review.ProductId);

            await _unitOfWork.CommitTransactionAsync();

            // Fetch with user info
            var updatedReview = await _unitOfWork.Reviews.GetUserReviewForProductAsync(userId, review.ProductId);
            return MapToDto(updatedReview!);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // DELETE REVIEW
    // ==========================================
    public async Task DeleteReviewAsync(Guid userId, Guid reviewId)
    {
        var review = await _unitOfWork.Reviews.GetByIdAsync(reviewId);
        if (review == null)
        {
            throw new NotFoundException("Review not found");
        }

        // Ownership check
        if (review.UserId != userId)
        {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        var productId = review.ProductId;

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            _unitOfWork.Reviews.SoftDelete(review);
            await _unitOfWork.SaveChangesAsync();

            // Update product's rating aggregates
            await UpdateProductRatingAsync(productId);

            await _unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    // Auto-update product's average rating + total count
    private async Task UpdateProductRatingAsync(Guid productId)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null) return;

        var (avgRating, totalCount, _) =
            await _unitOfWork.Reviews.GetProductReviewStatsAsync(productId);

        product.AverageRating = avgRating;
        product.TotalReviews = totalCount;

        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveChangesAsync();
    }

    private void ValidateTenant()
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }
    }

    private static ReviewDto MapToDto(Review review)
    {
        var userName = review.User?.FullName ?? "Anonymous";
        var initial = !string.IsNullOrEmpty(userName)
            ? userName.Trim()[0].ToString().ToUpper()
            : "?";

        return new ReviewDto
        {
            Id = review.Id,
            ProductId = review.ProductId,
            UserId = review.UserId,
            UserName = userName,
            UserInitial = initial,
            Rating = review.Rating,
            Title = review.Title,
            Comment = review.Comment,
            IsVerifiedPurchase = review.IsVerifiedPurchase,
            HelpfulCount = review.HelpfulCount,
            CreatedAt = review.CreatedAt,
            UpdatedAt = review.UpdatedAt
        };
    }
}