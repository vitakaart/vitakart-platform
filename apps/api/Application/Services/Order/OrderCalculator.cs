// File: apps/api/Application/Services/Order/Helpers/OrderCalculator.cs
// Handles all pricing calculations for orders
// Single Responsibility: Calculate money

using api.Domain.Entities;

namespace api.Application.Services.Order.Helpers;

public class OrderCalculator
{
    // Business rules (easy to change here)
    public const decimal FREE_SHIPPING_THRESHOLD = 499m;
    public const decimal SHIPPING_FEE = 49m;
    public const decimal TAX_RATE = 0m; // GST — for future

    // Result of all calculations
    public class OrderTotals
    {
        public decimal Subtotal { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal ShippingFee { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal CouponDiscount { get; set; }
        public decimal Total { get; set; }
    }

    // Calculate all totals from cart items
    public OrderTotals Calculate(List<CartItem> cartItems, decimal couponDiscount = 0)
    {
        decimal subtotal = 0;
        decimal totalDiscount = 0;

        foreach (var item in cartItems)
        {
            var effectivePrice = item.DiscountPrice ?? item.UnitPrice;
            var itemTotal = effectivePrice * item.Quantity;
            var itemSaved = (item.UnitPrice - effectivePrice) * item.Quantity;

            subtotal += itemTotal;
            totalDiscount += itemSaved;
        }

        var shippingFee = CalculateShipping(subtotal);
        var taxAmount = CalculateTax(subtotal);
        var total = subtotal + shippingFee + taxAmount - couponDiscount;

        return new OrderTotals
        {
            Subtotal = subtotal,
            TotalDiscount = totalDiscount,
            ShippingFee = shippingFee,
            TaxAmount = taxAmount,
            CouponDiscount = couponDiscount,
            Total = total,
        };
    }

    // Calculate shipping fee (free above threshold)
    public decimal CalculateShipping(decimal subtotal)
    {
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    }

    // Calculate tax (GST) — 0 for now
    public decimal CalculateTax(decimal subtotal)
    {
        return subtotal * TAX_RATE;
    }

    // Calculate item-level totals (for OrderItem creation)
    public (decimal EffectivePrice, decimal TotalPrice, decimal SavedAmount) CalculateItemTotals(
        decimal unitPrice, decimal? discountPrice, int quantity)
    {
        var effectivePrice = discountPrice ?? unitPrice;
        var totalPrice = effectivePrice * quantity;
        var savedAmount = (unitPrice - effectivePrice) * quantity;

        return (effectivePrice, totalPrice, savedAmount);
    }
}