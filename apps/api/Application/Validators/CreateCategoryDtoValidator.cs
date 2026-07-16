// File: apps/api/Application/Validators/CreateCategoryDtoValidator.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

public class CreateCategoryDtoValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required")
            .MinimumLength(2).WithMessage("Category name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Category name cannot exceed 100 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required")
            .MinimumLength(2).WithMessage("Slug must be at least 2 characters")
            .MaximumLength(100).WithMessage("Slug cannot exceed 100 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase with hyphens (e.g., 'health-supplements')");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrl).WithMessage("Invalid image URL")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.SortOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sort order cannot be negative");

        RuleFor(x => x.MetaTitle)
            .MaximumLength(200).WithMessage("Meta title cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.MetaTitle));

        RuleFor(x => x.MetaDescription)
            .MaximumLength(500).WithMessage("Meta description cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.MetaDescription));
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var result)
            && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}