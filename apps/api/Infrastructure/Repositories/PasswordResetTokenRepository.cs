// File: apps/api/Infrastructure/Repositories/PasswordResetTokenRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class PasswordResetTokenRepository :
    Repository<PasswordResetToken>, IPasswordResetTokenRepository
{
    public PasswordResetTokenRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // Get token with user info
    public async Task<PasswordResetToken?> GetByTokenAsync(string token)
    {
        return await _context.PasswordResetTokens
            .Include(t => t.User)
            .Where(t => !t.IsDeleted)
            .FirstOrDefaultAsync(t => t.Token == token);
    }

    // Invalidate all previous tokens (when new reset requested)
    public async Task InvalidateUserTokensAsync(Guid userId)
    {
        var activeTokens = await Query()
            .Where(t => t.UserId == userId && !t.IsUsed)
            .ToListAsync();

        foreach (var token in activeTokens)
        {
            token.IsUsed = true;
            token.UsedAt = DateTime.UtcNow;
        }
    }
}