// File: apps/api/Application/Validators/AddToCartDtoValidator.cs

using api.Application.DTOs;
using FluentValidation;

namespace api.Application.Validators;

public class AddToCartDtoValidator : AbstractValidator<AddToCartDto>
{
    public AddToCartDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be at least 1")
            .LessThanOrEqualTo(99).WithMessage("Maximum quantity is 99");
    }
}

public class UpdateCartItemDtoValidator : AbstractValidator<UpdateCartItemDto>
{
    public UpdateCartItemDtoValidator()
    {
        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be at least 1")
            .LessThanOrEqualTo(99).WithMessage("Maximum quantity is 99");
    }
}