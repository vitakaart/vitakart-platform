// File: apps/api/Application/Validators/UpdateProfileValidator.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

public class UpdateProfileValidator : AbstractValidator<UpdateProfileDto>
{
    public UpdateProfileValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z\s]+$").WithMessage("Name can only contain letters and spaces");

        RuleFor(x => x.Phone)
            .Matches(@"^[6-9]\d{9}$").WithMessage("Enter valid Indian mobile number")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}