// File: apps/api/Application/Validators/OrderValidators.cs
// FluentValidation for Order DTOs

using api.Application.DTOs.Order;
using api.Domain.Enums;
using FluentValidation;

namespace api.Application.Validators;

// ==========================================
// CREATE ORDER VALIDATOR
// ==========================================
public class CreateOrderDtoValidator : AbstractValidator<CreateOrderDto>
{
    public CreateOrderDtoValidator()
    {
        // Payment method
        RuleFor(x => x.PaymentMethod)
            .IsInEnum().WithMessage("Invalid payment method");

        // Full name
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        // Phone
        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required")
            .MinimumLength(10).WithMessage("Phone must be at least 10 digits")
            .MaximumLength(15).WithMessage("Phone cannot exceed 15 digits")
            .Matches(@"^[0-9+\-\s]+$").WithMessage("Invalid phone number format");

        // Address Line 1
        RuleFor(x => x.AddressLine1)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(200).WithMessage("Address cannot exceed 200 characters");

        // Address Line 2 (optional)
        RuleFor(x => x.AddressLine2)
            .MaximumLength(200).WithMessage("Address line 2 cannot exceed 200 characters")
            .When(x => x.AddressLine2 != null);

        // Landmark (optional)
        RuleFor(x => x.Landmark)
            .MaximumLength(100).WithMessage("Landmark cannot exceed 100 characters")
            .When(x => x.Landmark != null);

        // City
        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(50).WithMessage("City cannot exceed 50 characters");

        // State
        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(50).WithMessage("State cannot exceed 50 characters");

        // Pincode (Indian 6-digit)
        RuleFor(x => x.Pincode)
            .NotEmpty().WithMessage("Pincode is required")
            .Length(6).WithMessage("Pincode must be exactly 6 digits")
            .Matches(@"^[1-9][0-9]{5}$").WithMessage("Invalid pincode");

        // Country (optional, defaults to India)
        RuleFor(x => x.Country)
            .MaximumLength(50).WithMessage("Country cannot exceed 50 characters")
            .When(x => x.Country != null);

        // Customer notes (optional)
        RuleFor(x => x.CustomerNotes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters")
            .When(x => x.CustomerNotes != null);

        // Coupon code (optional)
        RuleFor(x => x.CouponCode)
            .MaximumLength(50).WithMessage("Coupon code cannot exceed 50 characters")
            .When(x => x.CouponCode != null);

        // Idempotency key (optional)
        RuleFor(x => x.IdempotencyKey)
            .MaximumLength(100).WithMessage("Idempotency key too long")
            .When(x => x.IdempotencyKey != null);
    }
}

// ==========================================
// CANCEL ORDER VALIDATOR
// ==========================================
public class CancelOrderDtoValidator : AbstractValidator<CancelOrderDto>
{
    public CancelOrderDtoValidator()
    {
        RuleFor(x => x.Reason)
            .MaximumLength(500).WithMessage("Reason cannot exceed 500 characters")
            .When(x => x.Reason != null);
    }
}