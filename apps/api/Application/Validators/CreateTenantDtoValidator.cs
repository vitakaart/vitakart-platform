// File: apps/api/Application/Validators/CreateTenantDtoValidator.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

public class CreateTenantDtoValidator : AbstractValidator<CreateTenantDto>
{
    public CreateTenantDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tenant name is required")
            .MinimumLength(2).WithMessage("Tenant name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Tenant name cannot exceed 100 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required")
            .MinimumLength(2).WithMessage("Slug must be at least 2 characters")
            .MaximumLength(50).WithMessage("Slug cannot exceed 50 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase with hyphens (e.g., 'vitakart')");

        RuleFor(x => x.Domain)
            .MaximumLength(255).WithMessage("Domain cannot exceed 255 characters")
            .Matches(@"^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$")
            .WithMessage("Invalid domain format (e.g., 'vitakart.com')")
            .When(x => !string.IsNullOrEmpty(x.Domain));
    }
}