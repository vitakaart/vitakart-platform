// File: apps/api/Application/Services/Order/Helpers/OrderAddressValidator.cs
// Validates shipping address for orders
// Single Responsibility: Address validation

using api.Application.DTOs.Order;
using api.Domain.Exceptions;

namespace api.Application.Services.Order.Helpers;

public static class OrderAddressValidator
{
    public static void Validate(CreateOrderDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.FullName))
            throw new ValidationException("Full name is required");

        if (dto.FullName.Length < 2 || dto.FullName.Length > 100)
            throw new ValidationException("Full name must be between 2 and 100 characters");

        if (string.IsNullOrWhiteSpace(dto.Phone))
            throw new ValidationException("Phone number is required");

        if (dto.Phone.Length < 10 || dto.Phone.Length > 15)
            throw new ValidationException("Invalid phone number");

        if (string.IsNullOrWhiteSpace(dto.AddressLine1))
            throw new ValidationException("Address is required");

        if (dto.AddressLine1.Length > 200)
            throw new ValidationException("Address is too long");

        if (string.IsNullOrWhiteSpace(dto.City))
            throw new ValidationException("City is required");

        if (string.IsNullOrWhiteSpace(dto.State))
            throw new ValidationException("State is required");

        if (string.IsNullOrWhiteSpace(dto.Pincode))
            throw new ValidationException("Pincode is required");

        if (dto.Pincode.Length != 6 || !dto.Pincode.All(char.IsDigit))
            throw new ValidationException("Invalid pincode (must be 6 digits)");
    }
}