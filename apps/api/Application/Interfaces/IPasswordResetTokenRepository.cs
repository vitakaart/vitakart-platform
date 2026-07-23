// File: apps/api/Application/Interfaces/IPasswordResetTokenRepository.cs

using api.Domain.Entities;

namespace api.Application.Interfaces;

public interface IPasswordResetTokenRepository : IRepository<PasswordResetToken>
{
    // Get valid token by token string (with user)
    Task<PasswordResetToken?> GetByTokenAsync(string token);

    // Invalidate all previous unused tokens for a user
    Task InvalidateUserTokensAsync(Guid userId);
}