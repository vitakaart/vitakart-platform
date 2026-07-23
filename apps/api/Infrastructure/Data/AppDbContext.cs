// File: apps/api/Infrastructure/Data/AppDbContext.cs
// Added Order + OrderItem configuration

using api.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    public DbSet<Address> Addresses { get; set; }

    public DbSet<Wishlist> Wishlists { get; set; }

    public DbSet<Review> Reviews { get; set; }

    public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<CouponUsage> CouponUsages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Tenant table rules
        modelBuilder.Entity<Tenant>(entity =>
        {
            entity.HasIndex(t => t.Slug).IsUnique();
            entity.HasIndex(t => t.Domain).IsUnique();
        });

        // User table rules
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => new { u.Email, u.TenantId }).IsUnique();

            entity.Property(u => u.Role)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // Category table rules
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => new { c.Slug, c.TenantId }).IsUnique();

            entity.HasOne(c => c.ParentCategory)
                .WithMany(c => c.SubCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(c => c.ParentCategoryId);
        });

        // Product table rules
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(p => new { p.Slug, p.TenantId }).IsUnique();

            entity.Property(p => p.Price).HasPrecision(10, 2);
            entity.Property(p => p.DiscountPrice).HasPrecision(10, 2);
            // Review aggregates precision
            entity.Property(p => p.AverageRating).HasPrecision(3, 2);


            entity.HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(p => p.CategoryId);
            entity.HasIndex(p => new { p.TenantId, p.IsActive });
            entity.HasIndex(p => new { p.TenantId, p.IsFeatured });
        });

        // RefreshToken table rules
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.Property(e => e.Token)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(e => e.DeviceInfo)
                .HasMaxLength(500);

            entity.Property(e => e.IpAddress)
                .HasMaxLength(45);

            entity.HasIndex(e => e.Token).IsUnique();
            entity.HasIndex(e => new { e.UserId, e.TenantId });

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Tenant)
                .WithMany()
                .HasForeignKey(e => e.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Cart configuration
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.HasIndex(c => new { c.UserId, c.TenantId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            entity.Property(c => c.CouponCode)
                .HasMaxLength(50);

            entity.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(c => c.Tenant)
                .WithMany()
                .HasForeignKey(c => c.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(c => c.Items)
                .WithOne(i => i.Cart)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // Coupon relationship
            entity.Property(c => c.CouponDiscount).HasPrecision(10, 2);

            entity.HasOne(c => c.Coupon)
                .WithMany()
                .HasForeignKey(c => c.CouponId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // CartItem configuration
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(i => i.Id);

            entity.Property(i => i.UnitPrice)
                .HasPrecision(10, 2);

            entity.Property(i => i.DiscountPrice)
                .HasPrecision(10, 2);

            entity.Property(i => i.Quantity)
                .IsRequired();

            entity.HasIndex(i => new { i.CartId, i.ProductId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            entity.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(i => i.Cart)
                .WithMany(c => c.Items)
                .HasForeignKey(i => i.CartId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // ORDER CONFIGURATION (NEW)
        // ==========================================
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            // Order number — unique + indexed for fast lookups
            entity.Property(o => o.OrderNumber)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasIndex(o => o.OrderNumber)
                .IsUnique();

            // Store enums as strings (readable in DB)
            entity.Property(o => o.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(o => o.PaymentStatus)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(o => o.PaymentMethod)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            // Money precision
            entity.Property(o => o.Subtotal).HasPrecision(10, 2);
            entity.Property(o => o.TotalDiscount).HasPrecision(10, 2);
            entity.Property(o => o.ShippingFee).HasPrecision(10, 2);
            entity.Property(o => o.TaxAmount).HasPrecision(10, 2);
            entity.Property(o => o.CouponDiscount).HasPrecision(10, 2);
            entity.Property(o => o.Total).HasPrecision(10, 2);

            // Shipping address fields
            entity.Property(o => o.ShippingFullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(o => o.ShippingPhone)
                .IsRequired()
                .HasMaxLength(15);

            entity.Property(o => o.ShippingAddressLine1)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(o => o.ShippingAddressLine2)
                .HasMaxLength(200);

            entity.Property(o => o.ShippingLandmark)
                .HasMaxLength(100);

            entity.Property(o => o.ShippingCity)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(o => o.ShippingState)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(o => o.ShippingPincode)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(o => o.ShippingCountry)
                .IsRequired()
                .HasMaxLength(50);

            // Payment fields
            entity.Property(o => o.PaymentTransactionId)
                .HasMaxLength(100);

            entity.Property(o => o.PaymentGatewayOrderId)
                .HasMaxLength(100);

            entity.Property(o => o.PaymentSignature)
                .HasMaxLength(500);

            // Notes and coupon
            entity.Property(o => o.CustomerNotes)
                .HasMaxLength(500);

            entity.Property(o => o.CouponCode)
                .HasMaxLength(50);

            entity.Property(o => o.CancellationReason)
                .HasMaxLength(500);

            entity.Property(o => o.CancelledBy)
                .HasMaxLength(50);

            // Tracking fields
            entity.Property(o => o.TrackingNumber)
                .HasMaxLength(100);

            entity.Property(o => o.CourierPartner)
                .HasMaxLength(100);

            // Idempotency key
            entity.Property(o => o.IdempotencyKey)
                .HasMaxLength(100);

            entity.HasIndex(o => new { o.UserId, o.IdempotencyKey })
                .IsUnique()
                .HasFilter("\"IdempotencyKey\" IS NOT NULL");

            // Indexes for fast queries
            entity.HasIndex(o => new { o.TenantId, o.UserId });
            entity.HasIndex(o => new { o.TenantId, o.Status });
            entity.HasIndex(o => new { o.TenantId, o.PaymentStatus });
            entity.HasIndex(o => o.CreatedAt);

            // Relations
            entity.HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Don't delete order if user deleted

            entity.HasOne(o => o.Tenant)
                .WithMany()
                .HasForeignKey(o => o.TenantId)
                .OnDelete(DeleteBehavior.Restrict);

            // Order items relation
            entity.HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // ORDER ITEM CONFIGURATION (NEW)
        // ==========================================
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(i => i.Id);

            // Product snapshot fields
            entity.Property(i => i.ProductName)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(i => i.ProductSlug)
                .IsRequired()
                .HasMaxLength(255);

            entity.Property(i => i.ProductImage)
                .HasMaxLength(500);

            entity.Property(i => i.ProductBrand)
                .HasMaxLength(100);

            entity.Property(i => i.ProductSku)
                .HasMaxLength(50);

            // Money precision
            entity.Property(i => i.UnitPrice).HasPrecision(10, 2);
            entity.Property(i => i.DiscountPrice).HasPrecision(10, 2);
            entity.Property(i => i.EffectivePrice).HasPrecision(10, 2);
            entity.Property(i => i.TotalPrice).HasPrecision(10, 2);
            entity.Property(i => i.SavedAmount).HasPrecision(10, 2);

            // Quantity required
            entity.Property(i => i.Quantity)
                .IsRequired();

            // Indexes
            entity.HasIndex(i => i.OrderId);
            entity.HasIndex(i => new { i.TenantId, i.ProductId });

            // Relations
            entity.HasOne(i => i.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Product reference — DON'T cascade delete (keep order intact if product deleted)
            entity.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });


        // ==========================================
        // ADDRESS CONFIGURATION
        // ==========================================
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(a => a.Id);

            // Contact info
            entity.Property(a => a.FullName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(a => a.Phone)
                .IsRequired()
                .HasMaxLength(15);

            // Address fields
            entity.Property(a => a.AddressLine1)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(a => a.AddressLine2)
                .HasMaxLength(200);

            entity.Property(a => a.Landmark)
                .HasMaxLength(100);

            entity.Property(a => a.City)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(a => a.State)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(a => a.Pincode)
                .IsRequired()
                .HasMaxLength(10);

            entity.Property(a => a.Country)
                .IsRequired()
                .HasMaxLength(50);

            // Enum as string
            entity.Property(a => a.Type)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            // Indexes for fast queries
            entity.HasIndex(a => new { a.TenantId, a.UserId });
            entity.HasIndex(a => new { a.UserId, a.IsDefault });

            // Relations
            entity.HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(a => a.Tenant)
                .WithMany()
                .HasForeignKey(a => a.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        // ==========================================
        // WISHLIST CONFIGURATION
        // ==========================================
        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.HasKey(w => w.Id);

            // Prevent duplicates — one product per user in wishlist
            entity.HasIndex(w => new { w.UserId, w.ProductId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            // Indexes for fast queries
            entity.HasIndex(w => new { w.TenantId, w.UserId });
            entity.HasIndex(w => w.ProductId);

            // Relations
            entity.HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Product)
                .WithMany()
                .HasForeignKey(w => w.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(w => w.Tenant)
                .WithMany()
                .HasForeignKey(w => w.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // REVIEW CONFIGURATION
        // ==========================================
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(r => r.Id);

            // One review per user per product
            entity.HasIndex(r => new { r.UserId, r.ProductId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            // Fast queries
            entity.HasIndex(r => new { r.TenantId, r.ProductId });
            entity.HasIndex(r => r.CreatedAt);

            // Rating check (1-5) — DB level constraint
            entity.Property(r => r.Rating)
                .IsRequired();

            // Title
            entity.Property(r => r.Title)
                .HasMaxLength(200);

            // Comment
            entity.Property(r => r.Comment)
                .IsRequired()
                .HasMaxLength(2000);

            // Relations
            entity.HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Product)
                .WithMany()
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(r => r.Tenant)
                .WithMany()
                .HasForeignKey(r => r.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // PASSWORD RESET TOKEN CONFIGURATION
        // ==========================================
        modelBuilder.Entity<PasswordResetToken>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.Property(t => t.Token)
                .IsRequired()
                .HasMaxLength(500);

            entity.Property(t => t.IpAddress)
                .HasMaxLength(45);

            // Unique token
            entity.HasIndex(t => t.Token).IsUnique();

            // Fast lookup
            entity.HasIndex(t => new { t.UserId, t.IsUsed });
            entity.HasIndex(t => t.ExpiresAt);

            // Relations
            entity.HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(t => t.Tenant)
                .WithMany()
                .HasForeignKey(t => t.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // COUPON CONFIGURATION
        // ==========================================
        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Code)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(c => c.Description)
                .HasMaxLength(500);

            entity.Property(c => c.Type)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired();

            entity.Property(c => c.Value).HasPrecision(10, 2);
            entity.Property(c => c.MaxDiscount).HasPrecision(10, 2);
            entity.Property(c => c.MinOrderAmount).HasPrecision(10, 2);

            // Unique code per tenant
            entity.HasIndex(c => new { c.Code, c.TenantId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");

            // Fast queries
            entity.HasIndex(c => new { c.TenantId, c.IsActive });
            entity.HasIndex(c => c.ValidUntil);

            entity.HasOne(c => c.Tenant)
                .WithMany()
                .HasForeignKey(c => c.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ==========================================
        // COUPON USAGE CONFIGURATION
        // ==========================================
        modelBuilder.Entity<CouponUsage>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.DiscountAmount).HasPrecision(10, 2);

            // Fast lookups
            entity.HasIndex(u => new { u.CouponId, u.UserId });
            entity.HasIndex(u => new { u.TenantId, u.UserId });

            entity.HasOne(u => u.Coupon)
                .WithMany()
                .HasForeignKey(u => u.CouponId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(u => u.User)
                .WithMany()
                .HasForeignKey(u => u.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(u => u.Order)
                .WithMany()
                .HasForeignKey(u => u.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(u => u.Tenant)
                .WithMany()
                .HasForeignKey(u => u.TenantId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}