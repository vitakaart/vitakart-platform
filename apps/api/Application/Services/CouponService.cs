// File: apps/api/Application/Services/CouponService.cs
// All coupon logic — validation, calculation, apply/remove

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class CouponService : ICouponService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICartService _cartService;

    public CouponService(IUnitOfWork unitOfWork, ICartService cartService)
    {
        _unitOfWork = unitOfWork;
        _cartService = cartService;
    }

    // ==========================================
    // VALIDATE COUPON
    // ==========================================
    public async Task<CouponValidationDto> ValidateCouponAsync(
        string code,
        Guid userId,
        decimal cartSubtotal)
    {
        // Get coupon
        var coupon = await _unitOfWork.Coupons.GetByCodeAsync(code);

        if (coupon == null)
        {
            return new CouponValidationDto
            {
                IsValid = false,
                Message = "Invalid coupon code"
            };
        }

        // Check active
        if (!coupon.IsActive)
        {
            return new CouponValidationDto
            {
                IsValid = false,
                Message = "This coupon is no longer active"
            };
        }

        // Check start date
        if (coupon.IsNotStarted)
        {
            return new CouponValidationDto
            {
                IsValid = false,
                Message = $"This coupon is valid from {coupon.ValidFrom:d MMM yyyy}"
            };
        }

        // Check expiry
        if (coupon.IsExpired)
        {
            return new CouponValidationDto
            {
                IsValid = false,
                Message = "This coupon has expired"
            };
        }

        // Check total usage limit
        if (coupon.HasReachedLimit)
        {
            return new CouponValidationDto
            {
                IsValid = false,
                Message = "This coupon has reached its usage limit"
            };
        }

        // Check minimum order amount
        if (cartSubtotal < coupon.MinOrderAmount)
        {
            var needMore = coupon.MinOrderAmount - cartSubtotal;
            return new CouponValidationDto
            {
                IsValid = false,
                Message = $"Add ₹{needMore:N0} more to use this coupon (min ₹{coupon.MinOrderAmount:N0})"
            };
        }

        // Check per-user limit
        if (coupon.PerUserLimit.HasValue)
        {
            var userUsageCount = await _unitOfWork.Coupons.GetUserUsageCountAsync(userId, coupon.Id);
            if (userUsageCount >= coupon.PerUserLimit.Value)
            {
                return new CouponValidationDto
                {
                    IsValid = false,
                    Message = coupon.PerUserLimit.Value == 1
                        ? "You have already used this coupon"
                        : $"You have reached the usage limit for this coupon"
                };
            }
        }

        //  All checks passed — calculate discount
        var discount = CalculateDiscount(coupon, cartSubtotal);

        return new CouponValidationDto
        {
            IsValid = true,
            Message = $"Coupon applied! You saved ₹{discount:N0}",
            DiscountAmount = discount,
            Coupon = MapToDto(coupon)
        };
    }

    // ==========================================
    // APPLY COUPON TO CART
    // ==========================================
    public async Task<CartDto> ApplyCouponToCartAsync(Guid userId, string code)
    {
        // Get user's cart
        var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        if (cart == null || cart.Items.Count == 0)
        {
            throw new ValidationException("Cart is empty");
        }

        // Calculate current subtotal
        var subtotal = cart.Items
            .Where(i => !i.IsDeleted)
            .Sum(i => i.TotalPrice);

        // Validate coupon
        var validation = await ValidateCouponAsync(code, userId, subtotal);

        if (!validation.IsValid)
        {
            throw new ValidationException(validation.Message);
        }

        // Get coupon entity
        var coupon = await _unitOfWork.Coupons.GetByCodeAsync(code);
        if (coupon == null)
        {
            throw new NotFoundException("Coupon not found");
        }

        // Apply to cart
        cart.CouponCode = coupon.Code;
        cart.CouponId = coupon.Id;
        cart.CouponDiscount = validation.DiscountAmount;

        _unitOfWork.Carts.Update(cart);
        await _unitOfWork.SaveChangesAsync();

        // Return updated cart
        return await _cartService.GetCartAsync(userId);
    }

    // ==========================================
    // REMOVE COUPON FROM CART
    // ==========================================
    public async Task<CartDto> RemoveCouponFromCartAsync(Guid userId)
    {
        var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        if (cart == null)
        {
            throw new NotFoundException("Cart not found");
        }

        cart.CouponCode = null;
        cart.CouponId = null;
        cart.CouponDiscount = 0;

        _unitOfWork.Carts.Update(cart);
        await _unitOfWork.SaveChangesAsync();

        return await _cartService.GetCartAsync(userId);
    }

    // ==========================================
    // GET ACTIVE COUPONS (for display)
    // ==========================================
    public async Task<List<CouponDto>> GetActiveCouponsAsync(Guid? userId = null)
    {
        var coupons = await _unitOfWork.Coupons.GetActiveCouponsAsync();

        var result = new List<CouponDto>();

        foreach (var coupon in coupons)
        {
            var dto = MapToDto(coupon);

            // Add user usage info if user is logged in
            if (userId.HasValue)
            {
                var usageCount = await _unitOfWork.Coupons
                    .GetUserUsageCountAsync(userId.Value, coupon.Id);

                dto.UserUsageCount = usageCount;
                dto.PerUserLimit = coupon.PerUserLimit;
                dto.IsUsedByUser = usageCount > 0;
                dto.CanUseAgain = !coupon.PerUserLimit.HasValue
                    || usageCount < coupon.PerUserLimit.Value;
            }

            result.Add(dto);
        }

        return result;
    }

    // ==========================================
    // GET SINGLE COUPON INFO
    // ==========================================
    public async Task<CouponDto?> GetCouponInfoAsync(string code)
    {
        var coupon = await _unitOfWork.Coupons.GetByCodeAsync(code);
        if (coupon == null || !coupon.IsValid) return null;

        return MapToDto(coupon);
    }

    // ==========================================
    // CALCULATE DISCOUNT (Public method)
    // ==========================================
    public decimal CalculateDiscount(Coupon coupon, decimal subtotal)
    {
        decimal discount;

        if (coupon.Type == CouponType.Percentage)
        {
            // e.g., 10% of 500 = 50
            discount = subtotal * (coupon.Value / 100);

            // Apply max cap if set
            if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount.Value)
            {
                discount = coupon.MaxDiscount.Value;
            }
        }
        else // Fixed
        {
            discount = coupon.Value;

            // Discount can't exceed subtotal
            if (discount > subtotal)
            {
                discount = subtotal;
            }
        }

        return Math.Round(discount, 2);
    }

    // ==========================================
    // PRIVATE HELPER — Map to DTO
    // ==========================================
    private static CouponDto MapToDto(Coupon coupon)
    {
        // Build display text
        string displayText;
        if (coupon.Type == CouponType.Percentage)
        {
            displayText = $"{coupon.Value:0.##}% OFF";
            if (coupon.MaxDiscount.HasValue)
            {
                displayText += $" up to ₹{coupon.MaxDiscount.Value:N0}";
            }
        }
        else
        {
            displayText = $"₹{coupon.Value:N0} OFF";
        }

        // Build condition text
        var conditions = new List<string>();
        if (coupon.MinOrderAmount > 0)
        {
            conditions.Add($"Min order ₹{coupon.MinOrderAmount:N0}");
        }
        if (coupon.ValidUntil.HasValue)
        {
            conditions.Add($"Expires {coupon.ValidUntil.Value:d MMM}");
        }
        var conditionText = string.Join(" • ", conditions);

        return new CouponDto
        {
            Id = coupon.Id,
            Code = coupon.Code,
            Description = coupon.Description,
            Type = coupon.Type.ToString(),
            Value = coupon.Value,
            MaxDiscount = coupon.MaxDiscount,
            MinOrderAmount = coupon.MinOrderAmount,
            ValidUntil = coupon.ValidUntil,
            DisplayText = displayText,
            ConditionText = conditionText
        };
    }
}