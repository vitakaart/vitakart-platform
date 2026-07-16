// File: apps/api/Application/Interfaces/IUserRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByEmailAndTenantAsync(string email, Guid tenantId);
    Task<bool> EmailExistsAsync(string email, Guid tenantId);
}