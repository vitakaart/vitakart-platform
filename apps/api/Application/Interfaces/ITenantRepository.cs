// File: apps/api/Application/Interfaces/ITenantRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface ITenantRepository : IRepository<Tenant>
{
    Task<Tenant?> GetBySlugAsync(string slug);
    Task<bool> SlugExistsAsync(string slug);
}