// File: apps/api/Application/Interfaces/IAddressService.cs

using api.Application.DTOs;

namespace api.Application.Interfaces;

public interface IAddressService
{
    // Get all user's addresses (default first)
    Task<List<AddressDto>> GetUserAddressesAsync(Guid userId);

    // Get single address by ID
    Task<AddressDto> GetAddressByIdAsync(Guid userId, Guid addressId);

    // Get user's default address (nullable)
    Task<AddressDto?> GetDefaultAddressAsync(Guid userId);

    // Create new address
    Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressDto dto);

    // Update existing address
    Task<AddressDto> UpdateAddressAsync(Guid userId, Guid addressId, UpdateAddressDto dto);

    // Set address as default
    Task<AddressDto> SetDefaultAddressAsync(Guid userId, Guid addressId);

    // Delete address (soft delete)
    Task DeleteAddressAsync(Guid userId, Guid addressId);
}