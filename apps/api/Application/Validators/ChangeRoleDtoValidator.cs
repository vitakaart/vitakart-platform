// File: apps/api/Application/Validators/ChangeRoleDtoValidator.cs

using api.Application.DTOs;
using api.Domain.Enums;
using FluentValidation;

namespace api.Application.Validators;

public class ChangeRoleDtoValidator : AbstractValidator<ChangeRoleDto>
{
    public ChangeRoleDtoValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.NewRole)
            .IsInEnum().WithMessage("Invalid role. Valid values: Customer (1), Vendor (2), Admin (3), SuperAdmin (4)");
    }
}