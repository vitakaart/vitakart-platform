// File: apps/api/Domain/Enums/PaymentMethod.cs
// Supported payment methods

namespace api.Domain.Enums;

public enum PaymentMethod
{
    // Cash on Delivery
    COD = 0,

    // Razorpay gateway (Cards, UPI, Wallets, NetBanking)
    Razorpay = 1,

    // Direct UPI payment
    UPI = 2,

    // Credit/Debit Card
    Card = 3,

    // Net Banking
    NetBanking = 4,

    // Wallet (Paytm, PhonePe, etc.)
    Wallet = 5
}