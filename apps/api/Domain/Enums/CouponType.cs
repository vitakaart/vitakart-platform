// File: apps/api/Domain/Enums/CouponType.cs

namespace api.Domain.Enums;

public enum CouponType
{
    Percentage,   // % off (e.g., 10% off)
    Fixed         // Flat amount off (e.g., ₹100 off)
}