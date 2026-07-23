// File: apps/api/Application/Services/CartService.cs
// Cart service with coupon auto-revalidation

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class CartService : ICartService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    private const decimal FREE_SHIPPING_THRESHOLD = 499;
    private const decimal SHIPPING_FEE = 49;

    public CartService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // ==========================================
    // GET CART
    // ==========================================
    public async Task<CartDto> GetCartAsync(Guid userId)
    {
        var cart = await _unitOfWork.Carts.GetOrCreateCartAsync(userId);
        return MapToDto(cart);
    }

    // ==========================================
    // ADD TO CART
    // ==========================================
    public async Task<CartDto> AddToCartAsync(Guid userId, AddToCartDto dto)
    {
        // Validate quantity
        if (dto.Quantity < 1)
        {
            throw new ValidationException("Quantity must be at least 1");
        }

        if (dto.Quantity > 99)
        {
            throw new ValidationException("Maximum quantity per item is 99");
        }

        // Get product
        var product = await _unitOfWork.Products.GetByIdAsync(dto.ProductId);
        if (product == null)
        {
            throw new NotFoundException("Product not found");
        }

        // Check product is active
        if (!product.IsActive)
        {
            throw new ValidationException("Product is not available");
        }

        // Check stock
        if (product.StockQuantity < dto.Quantity)
        {
            throw new ValidationException(
                $"Only {product.StockQuantity} items available in stock");
        }

        // Get or create cart
        var cart = await _unitOfWork.Carts.GetOrCreateCartAsync(userId);

        // Check if product already in cart
        var existingItem = await _unitOfWork.Carts.GetCartItemAsync(cart.Id, dto.ProductId);

        if (existingItem != null)
        {
            // Update quantity
            var newQuantity = existingItem.Quantity + dto.Quantity;

            if (newQuantity > product.StockQuantity)
            {
                throw new ValidationException(
                    $"Cannot add more. Only {product.StockQuantity} in stock, you already have {existingItem.Quantity} in cart");
            }

            if (newQuantity > 99)
            {
                throw new ValidationException("Maximum quantity per item is 99");
            }

            existingItem.Quantity = newQuantity;
            existingItem.UnitPrice = product.Price;
            existingItem.DiscountPrice = product.DiscountPrice;

            _unitOfWork.Carts.UpdateCartItem(existingItem);
        }
        else
        {
            // Create new cart item
            var newItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = product.Price,
                DiscountPrice = product.DiscountPrice,
            };

            await _unitOfWork.Carts.AddCartItemAsync(newItem);
        }

        await _unitOfWork.SaveChangesAsync();

        // ✅ Re-validate coupon (subtotal changed)
        await RevalidateCouponAsync(userId);

        // Refetch cart with all details
        var updatedCart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        return MapToDto(updatedCart!);
    }

    // ==========================================
    // UPDATE CART ITEM
    // ==========================================
    public async Task<CartDto> UpdateCartItemAsync(Guid userId, Guid itemId, UpdateCartItemDto dto)
    {
        if (dto.Quantity < 1)
        {
            throw new ValidationException("Quantity must be at least 1");
        }

        if (dto.Quantity > 99)
        {
            throw new ValidationException("Maximum quantity per item is 99");
        }

        // Get cart item
        var cartItem = await _unitOfWork.Carts.GetCartItemByIdAsync(itemId);
        if (cartItem == null)
        {
            throw new NotFoundException("Cart item not found");
        }

        // Verify ownership (security)
        if (cartItem.Cart.UserId != userId)
        {
            throw new UnauthorizedException("You cannot update this cart item");
        }

        // Check stock
        if (cartItem.Product.StockQuantity < dto.Quantity)
        {
            throw new ValidationException(
                $"Only {cartItem.Product.StockQuantity} items available in stock");
        }

        // Update quantity
        cartItem.Quantity = dto.Quantity;
        _unitOfWork.Carts.UpdateCartItem(cartItem);

        await _unitOfWork.SaveChangesAsync();

        // ✅ Re-validate coupon
        await RevalidateCouponAsync(userId);

        // Return updated cart
        var updatedCart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        return MapToDto(updatedCart!);
    }

    // ==========================================
    // REMOVE CART ITEM
    // ==========================================
    public async Task<CartDto> RemoveCartItemAsync(Guid userId, Guid itemId)
    {
        var cartItem = await _unitOfWork.Carts.GetCartItemByIdAsync(itemId);
        if (cartItem == null)
        {
            throw new NotFoundException("Cart item not found");
        }

        // Verify ownership
        if (cartItem.Cart.UserId != userId)
        {
            throw new UnauthorizedException("You cannot remove this cart item");
        }

        // Soft delete
        cartItem.IsDeleted = true;
        _unitOfWork.Carts.UpdateCartItem(cartItem);

        await _unitOfWork.SaveChangesAsync();

        // ✅ Re-validate coupon
        await RevalidateCouponAsync(userId);

        var updatedCart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        return MapToDto(updatedCart!);
    }

    // ==========================================
    // CLEAR CART
    // ==========================================
    public async Task<CartDto> ClearCartAsync(Guid userId)
    {
        var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        if (cart == null)
        {
            return await GetCartAsync(userId);
        }

        // Soft delete all items
        foreach (var item in cart.Items)
        {
            item.IsDeleted = true;
            _unitOfWork.Carts.UpdateCartItem(item);
        }

        // ✅ Clear coupon completely
        cart.CouponCode = null;
        cart.CouponId = null;
        cart.CouponDiscount = 0;
        _unitOfWork.Carts.Update(cart);

        await _unitOfWork.SaveChangesAsync();

        return await GetCartAsync(userId);
    }

    // ==========================================
    // PRIVATE HELPERS
    // ==========================================

    private CartDto MapToDto(Cart cart)
    {
        var items = cart.Items?
            .Where(i => !i.IsDeleted)
            .Select(item => MapItemToDto(item))
            .ToList() ?? new List<CartItemDto>();

        var subtotal = items.Sum(i => i.TotalPrice);
        var productDiscount = items.Sum(i => i.SavedAmount);
        var shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

        // ✅ Coupon discount (from cart)
        var couponDiscount = cart.CouponDiscount;

        // Total = subtotal - coupon discount + shipping
        var total = subtotal - couponDiscount + shippingFee;

        // Prevent negative total
        if (total < 0) total = 0;

        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            CouponCode = cart.CouponCode,
            CouponDiscount = couponDiscount,
            Items = items,
            TotalItems = items.Sum(i => i.Quantity),
            UniqueItemsCount = items.Count,
            Subtotal = subtotal,
            TotalDiscount = productDiscount,
            ShippingFee = shippingFee,
            Total = total,
            CreatedAt = cart.CreatedAt,
            UpdatedAt = cart.UpdatedAt,
        };
    }

    private CartItemDto MapItemToDto(CartItem item)
    {
        return new CartItemDto
        {
            Id = item.Id,
            ProductId = item.ProductId,
            ProductName = item.Product?.Name ?? "Unknown Product",
            ProductSlug = item.Product?.Slug ?? "",
            ProductImage = item.Product?.ImageUrl,
            Brand = item.Product?.Brand,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            DiscountPrice = item.DiscountPrice,
            EffectivePrice = item.EffectivePrice,
            TotalPrice = item.TotalPrice,
            SavedAmount = item.SavedAmount,
            AvailableStock = item.Product?.StockQuantity ?? 0,
            InStock = (item.Product?.StockQuantity ?? 0) > 0,
        };
    }

    // ==========================================
    // AUTO REVALIDATE COUPON
    // If coupon exists but no longer valid, remove it
    // If still valid, recalculate discount amount
    // ==========================================
    private async Task RevalidateCouponAsync(Guid userId)
    {
        var cart = await _unitOfWork.Carts.GetUserCartAsync(userId);
        if (cart == null || string.IsNullOrEmpty(cart.CouponCode) || !cart.CouponId.HasValue)
        {
            return;
        }

        var coupon = await _unitOfWork.Coupons.GetByIdAsync(cart.CouponId.Value);
        if (coupon == null || !coupon.IsValid)
        {
            // Remove invalid coupon
            cart.CouponCode = null;
            cart.CouponId = null;
            cart.CouponDiscount = 0;
            _unitOfWork.Carts.Update(cart);
            await _unitOfWork.SaveChangesAsync();
            return;
        }

        // Recalculate subtotal
        var subtotal = cart.Items.Where(i => !i.IsDeleted).Sum(i => i.TotalPrice);

        // Check if still meets minimum
        if (subtotal < coupon.MinOrderAmount)
        {
            cart.CouponCode = null;
            cart.CouponId = null;
            cart.CouponDiscount = 0;
            _unitOfWork.Carts.Update(cart);
            await _unitOfWork.SaveChangesAsync();
            return;
        }

        // Recalculate discount amount
        decimal discount;
        if (coupon.Type == CouponType.Percentage)
        {
            discount = subtotal * (coupon.Value / 100);
            if (coupon.MaxDiscount.HasValue && discount > coupon.MaxDiscount.Value)
            {
                discount = coupon.MaxDiscount.Value;
            }
        }
        else
        {
            discount = coupon.Value;
            if (discount > subtotal) discount = subtotal;
        }

        cart.CouponDiscount = Math.Round(discount, 2);
        _unitOfWork.Carts.Update(cart);
        await _unitOfWork.SaveChangesAsync();
    }
}