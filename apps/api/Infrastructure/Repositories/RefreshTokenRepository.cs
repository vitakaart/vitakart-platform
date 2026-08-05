// File: apps/api/Infrastructure/Repositories/RefreshTokenRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class RefreshTokenRepository : Repository<RefreshToken>, IRefreshTokenRepository
{
    public RefreshTokenRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await QueryUnfiltered()
            .FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task<RefreshToken?> GetByTokenWithUserAsync(string token)
    {
        return await QueryUnfiltered()
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task<int> RevokeAllUserTokensAsync(Guid userId, string? reason = null)
    {
        var tokens = await QueryUnfiltered()
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
            .ToListAsync();

        var now = DateTime.UtcNow;
        foreach (var token in tokens)
        {
            token.RevokedAt = now;
            token.UpdatedAt = now;
            
            // Store reason in ReplacedByToken field for audit
            if (!string.IsNullOrEmpty(reason))
            {
                token.ReplacedByToken = reason;
            }
        }
        
        return tokens.Count;
    }
}