// File: apps/api/Application/Interfaces/IRefreshTokenRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task<RefreshToken?> GetByTokenWithUserAsync(string token);
    Task RevokeAllUserTokensAsync(Guid userId);
}