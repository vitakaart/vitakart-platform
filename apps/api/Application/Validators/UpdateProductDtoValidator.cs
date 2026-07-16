// File: apps/api/Application/Validators/UpdateProductDtoValidator.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
{
    public UpdateProductDtoValidator()
    {
        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MinimumLength(2).WithMessage("Product name must be at least 2 characters")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Slug is required")
            .MinimumLength(2).WithMessage("Slug must be at least 2 characters")
            .MaximumLength(200).WithMessage("Slug cannot exceed 200 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase with hyphens");

        RuleFor(x => x.Sku)
            .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters")
            .Matches(@"^[A-Z0-9-_]+$").WithMessage("SKU must be uppercase alphanumeric with hyphens/underscores")
            .When(x => !string.IsNullOrEmpty(x.Sku));

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description cannot exceed 5000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ShortDescription)
            .MaximumLength(500).WithMessage("Short description cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ShortDescription));

        RuleFor(x => x.Brand)
            .MaximumLength(100).WithMessage("Brand cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Brand));

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0")
            .LessThan(10000000).WithMessage("Price is too high");

        RuleFor(x => x.DiscountPrice)
            .GreaterThan(0).WithMessage("Discount price must be greater than 0")
            .LessThan(x => x.Price).WithMessage("Discount price must be less than regular price")
            .When(x => x.DiscountPrice.HasValue);

        RuleFor(x => x.ImageUrl)
            .Must(BeValidUrl).WithMessage("Invalid image URL")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative");
    }

    private bool BeValidUrl(string? url)
    {
        if (string.IsNullOrEmpty(url)) return true;
        return Uri.TryCreate(url, UriKind.Absolute, out var result)
            && (result.Scheme == Uri.UriSchemeHttp || result.Scheme == Uri.UriSchemeHttps);
    }
}