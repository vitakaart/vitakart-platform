// File: apps/api/Application/Validators/AddressValidators.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

// Create Address Validator
public class CreateAddressValidator : AbstractValidator<CreateAddressDto>
{
    public CreateAddressValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MinimumLength(2).WithMessage("Name too short")
            .MaximumLength(100).WithMessage("Name too long")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name can only contain letters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .Matches(@"^[6-9]\d{9}$").WithMessage("Enter valid Indian mobile number");

        RuleFor(x => x.AddressLine1)
            .NotEmpty().WithMessage("Address line 1 is required")
            .MinimumLength(5).WithMessage("Address too short")
            .MaximumLength(200).WithMessage("Address too long");

        RuleFor(x => x.AddressLine2)
            .MaximumLength(200).WithMessage("Address line 2 too long")
            .When(x => !string.IsNullOrEmpty(x.AddressLine2));

        RuleFor(x => x.Landmark)
            .MaximumLength(100).WithMessage("Landmark too long")
            .When(x => !string.IsNullOrEmpty(x.Landmark));

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(50).WithMessage("City name too long");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(50).WithMessage("State name too long");

        RuleFor(x => x.Pincode)
            .NotEmpty().WithMessage("Pincode is required")
            .Matches(@"^\d{6}$").WithMessage("Enter valid 6-digit Indian pincode");

        RuleFor(x => x.Country)
            .MaximumLength(50);

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid address type");
    }
}

// Update Address Validator (same rules)
public class UpdateAddressValidator : AbstractValidator<UpdateAddressDto>
{
    public UpdateAddressValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MinimumLength(2).WithMessage("Name too short")
            .MaximumLength(100).WithMessage("Name too long")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name can only contain letters");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .Matches(@"^[6-9]\d{9}$").WithMessage("Enter valid Indian mobile number");

        RuleFor(x => x.AddressLine1)
            .NotEmpty().WithMessage("Address line 1 is required")
            .MinimumLength(5).WithMessage("Address too short")
            .MaximumLength(200).WithMessage("Address too long");

        RuleFor(x => x.AddressLine2)
            .MaximumLength(200).WithMessage("Address line 2 too long")
            .When(x => !string.IsNullOrEmpty(x.AddressLine2));

        RuleFor(x => x.Landmark)
            .MaximumLength(100).WithMessage("Landmark too long")
            .When(x => !string.IsNullOrEmpty(x.Landmark));

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(50).WithMessage("City name too long");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .MaximumLength(50).WithMessage("State name too long");

        RuleFor(x => x.Pincode)
            .NotEmpty().WithMessage("Pincode is required")
            .Matches(@"^\d{6}$").WithMessage("Enter valid 6-digit Indian pincode");

        RuleFor(x => x.Country)
            .MaximumLength(50);

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid address type");
    }
}