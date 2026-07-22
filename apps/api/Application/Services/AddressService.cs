// File: apps/api/Application/Services/AddressService.cs
// Address CRUD with default management + validation

using api.Application.DTOs;
using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Exceptions;

namespace api.Application.Services;

public class AddressService : IAddressService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantContext _tenantContext;

    // Max addresses per user (prevent abuse)
    private const int MAX_ADDRESSES_PER_USER = 10;

    public AddressService(IUnitOfWork unitOfWork, ITenantContext tenantContext)
    {
        _unitOfWork = unitOfWork;
        _tenantContext = tenantContext;
    }

    // ==========================================
    // GET ALL USER ADDRESSES
    // ==========================================
    public async Task<List<AddressDto>> GetUserAddressesAsync(Guid userId)
    {
        var addresses = await _unitOfWork.Addresses.GetUserAddressesAsync(userId);
        return addresses.Select(MapToDto).ToList();
    }

    // ==========================================
    // GET SINGLE ADDRESS
    // ==========================================
    public async Task<AddressDto> GetAddressByIdAsync(Guid userId, Guid addressId)
    {
        var address = await _unitOfWork.Addresses.GetUserAddressAsync(userId, addressId);

        if (address == null)
        {
            throw new NotFoundException("Address not found");
        }

        return MapToDto(address);
    }

    // ==========================================
    // GET DEFAULT ADDRESS (for checkout auto-fill)
    // ==========================================
    public async Task<AddressDto?> GetDefaultAddressAsync(Guid userId)
    {
        var address = await _unitOfWork.Addresses.GetDefaultAddressAsync(userId);
        return address == null ? null : MapToDto(address);
    }

    // ==========================================
    // CREATE ADDRESS
    // ==========================================
    public async Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressDto dto)
    {
        if (!_tenantContext.IsResolved)
        {
            throw new ValidationException("Tenant not resolved");
        }

        // Check max address limit
        var count = await _unitOfWork.Addresses.GetAddressCountAsync(userId);
        if (count >= MAX_ADDRESSES_PER_USER)
        {
            throw new ValidationException(
                $"You can have maximum {MAX_ADDRESSES_PER_USER} addresses. Please delete an old one.");
        }

        // Begin transaction (for setting default)
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // If this is the FIRST address → auto make default
            var isFirstAddress = count == 0;
            var shouldBeDefault = dto.IsDefault || isFirstAddress;

            // If setting as default → clear other defaults first
            if (shouldBeDefault)
            {
                await _unitOfWork.Addresses.ClearDefaultAsync(userId);
            }

            var address = new Address
            {
                TenantId = _tenantContext.TenantId!.Value,
                UserId = userId,
                FullName = dto.FullName.Trim(),
                Phone = dto.Phone.Trim(),
                AddressLine1 = dto.AddressLine1.Trim(),
                AddressLine2 = string.IsNullOrWhiteSpace(dto.AddressLine2)
                    ? null
                    : dto.AddressLine2.Trim(),
                Landmark = string.IsNullOrWhiteSpace(dto.Landmark)
                    ? null
                    : dto.Landmark.Trim(),
                City = dto.City.Trim(),
                State = dto.State.Trim(),
                Pincode = dto.Pincode.Trim(),
                Country = string.IsNullOrWhiteSpace(dto.Country) ? "India" : dto.Country.Trim(),
                Type = dto.Type,
                IsDefault = shouldBeDefault
            };

            await _unitOfWork.Addresses.AddAsync(address);
            await _unitOfWork.SaveChangesAsync();

            await _unitOfWork.CommitTransactionAsync();

            return MapToDto(address);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // UPDATE ADDRESS
    // ==========================================
    public async Task<AddressDto> UpdateAddressAsync(Guid userId, Guid addressId, UpdateAddressDto dto)
    {
        var address = await _unitOfWork.Addresses.GetUserAddressAsync(userId, addressId);

        if (address == null)
        {
            throw new NotFoundException("Address not found");
        }

        // Update fields (don't touch IsDefault here — separate endpoint)
        address.FullName = dto.FullName.Trim();
        address.Phone = dto.Phone.Trim();
        address.AddressLine1 = dto.AddressLine1.Trim();
        address.AddressLine2 = string.IsNullOrWhiteSpace(dto.AddressLine2)
            ? null
            : dto.AddressLine2.Trim();
        address.Landmark = string.IsNullOrWhiteSpace(dto.Landmark)
            ? null
            : dto.Landmark.Trim();
        address.City = dto.City.Trim();
        address.State = dto.State.Trim();
        address.Pincode = dto.Pincode.Trim();
        address.Country = string.IsNullOrWhiteSpace(dto.Country) ? "India" : dto.Country.Trim();
        address.Type = dto.Type;

        _unitOfWork.Addresses.Update(address);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(address);
    }

    // ==========================================
    // SET DEFAULT ADDRESS
    // ==========================================
    public async Task<AddressDto> SetDefaultAddressAsync(Guid userId, Guid addressId)
    {
        var address = await _unitOfWork.Addresses.GetUserAddressAsync(userId, addressId);

        if (address == null)
        {
            throw new NotFoundException("Address not found");
        }

        // Already default → return as-is
        if (address.IsDefault)
        {
            return MapToDto(address);
        }

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // Clear all other defaults
            await _unitOfWork.Addresses.ClearDefaultAsync(userId);

            // Set this one as default
            address.IsDefault = true;
            _unitOfWork.Addresses.Update(address);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            return MapToDto(address);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    // ==========================================
    // DELETE ADDRESS (Soft delete)
    // ==========================================
    public async Task DeleteAddressAsync(Guid userId, Guid addressId)
    {
        var address = await _unitOfWork.Addresses.GetUserAddressAsync(userId, addressId);

        if (address == null)
        {
            throw new NotFoundException("Address not found");
        }

        var wasDefault = address.IsDefault;

        _unitOfWork.Addresses.SoftDelete(address);
        await _unitOfWork.SaveChangesAsync();

        // If deleted address was default → make newest remaining address default
        if (wasDefault)
        {
            var remaining = await _unitOfWork.Addresses.GetUserAddressesAsync(userId);
            var newest = remaining.FirstOrDefault();

            if (newest != null)
            {
                newest.IsDefault = true;
                _unitOfWork.Addresses.Update(newest);
                await _unitOfWork.SaveChangesAsync();
            }
        }
    }

    // ==========================================
    // PRIVATE HELPER
    // ==========================================
    private static AddressDto MapToDto(Address address)
    {
        return new AddressDto
        {
            Id = address.Id,
            FullName = address.FullName,
            Phone = address.Phone,
            AddressLine1 = address.AddressLine1,
            AddressLine2 = address.AddressLine2,
            Landmark = address.Landmark,
            City = address.City,
            State = address.State,
            Pincode = address.Pincode,
            Country = address.Country,
            Type = address.Type.ToString(),
            IsDefault = address.IsDefault,
            CreatedAt = address.CreatedAt,
            UpdatedAt = address.UpdatedAt
        };
    }
}