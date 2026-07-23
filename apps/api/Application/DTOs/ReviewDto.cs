// File: apps/api/Application/DTOs/ReviewDto.cs
// All review-related DTOs

namespace api.Application.DTOs;

// ==========================================
// USER SENDS THESE
// ==========================================

// Create new review
public class CreateReviewDto
{
    public Guid ProductId { get; set; }
    public int Rating { get; set; }  // 1-5
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
}

// Update existing review
public class UpdateReviewDto
{
    public int Rating { get; set; }  // 1-5
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
}

// Query filters
public class ReviewQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public int? Rating { get; set; }  // Filter by rating (1-5)
}

// ==========================================
// API RETURNS THESE
// ==========================================

// Single review with user info
public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserInitial { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Title { get; set; }
    public string Comment { get; set; } = string.Empty;
    public bool IsVerifiedPurchase { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// Product review stats (breakdown)
public class ProductReviewStatsDto
{
    public decimal AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public Dictionary<int, int> RatingBreakdown { get; set; } = new();
    public Dictionary<int, decimal> RatingPercentage { get; set; } = new();
}

// Paginated reviews response
public class PaginatedReviewsDto
{
    public List<ReviewDto> Reviews { get; set; } = new();
    public ProductReviewStatsDto Stats { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasNextPage { get; set; }
    public bool HasPreviousPage { get; set; }
}

// Check response (can user review?)
public class ReviewEligibilityDto
{
    public bool CanReview { get; set; }
    public bool HasReviewed { get; set; }
    public bool HasPurchased { get; set; }
    public string? Reason { get; set; }
    public ReviewDto? ExistingReview { get; set; }
}