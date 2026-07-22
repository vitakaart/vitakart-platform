// File: apps/api/Application/Interfaces/IAddressRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;  

public interface IAddressRepository : IRepository<Address>
{
    Task<List<Address>> GetUserAddressesAsync(Guid userId);
    Task<Address?> GetUserAddressAsync(Guid userId, Guid addressId);
    Task<Address?> GetDefaultAddressAsync(Guid userId);
    Task<int> GetAddressCountAsync(Guid userId);
    Task ClearDefaultAsync(Guid userId);
}