// File: apps/api/Application/Interfaces/IUnitOfWork.cs
// Unit of Work pattern — manages transactions across multiple repositories

namespace api.Application.Interfaces;

public interface IUnitOfWork
{
    // Access all repositories
    ICategoryRepository Categories { get; }
    IProductRepository Products { get; }
    IUserRepository Users { get; }
    IRefreshTokenRepository RefreshTokens { get; }
    ITenantRepository Tenants { get; }
    ICartRepository Carts { get; }
    IOrderRepository Orders { get; }  

    IPaymentRepository Payments { get; }
    
    IAddressRepository Addresses { get; }
    IWishlistRepository Wishlists { get; }

    IReviewRepository Reviews { get; }
    IPasswordResetTokenRepository PasswordResetTokens { get; }

    ICouponRepository Coupons { get; }
ICouponUsageRepository CouponUsages { get; }

    // Save all changes in one transaction
    Task<int> SaveChangesAsync();

    // Begin explicit transaction (for complex scenarios)
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();

}