// File: apps/api/Program.cs
// Fully secured version with rate limiting, security headers, HTTPS enforcement
// Production-ready configuration

using api.API.Middleware;
using api.API.RateLimiting;
using api.Application.Interfaces;
using api.Application.Services;
using api.Application.Services.Order;
using api.Infrastructure.Data;
using api.Infrastructure.Repositories;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.RateLimiting;
using api.Infrastructure.Services.Email;
using api.Infrastructure.Services.Image;

Env.Load();

// IMPORTANT: Clear default claim mapping BEFORE anything else
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// ============================================
// CORS POLICY NAME
// ============================================
const string CorsPolicyName = "VitakartCorsPolicy";

// ============================================
// REQUEST SIZE LIMIT (Prevent DoS via large uploads)
// ============================================
var maxBodySizeMb = int.Parse(Environment.GetEnvironmentVariable("MAX_REQUEST_BODY_SIZE_MB") ?? "10");

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = maxBodySizeMb * 1024 * 1024;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = maxBodySizeMb * 1024 * 1024;
    options.AddServerHeader = false; // hide the server version for security
});


// ============================================
// FORWARDED HEADERS (accurate IP behind proxies)
// ============================================
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
});

// ============================================
// CONTROLLERS + ROUTING
// ============================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter()
        );
    });

builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Services.AddOpenApi();

// ============================================
// DATABASE
// ============================================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new Exception("DATABASE_URL not found in .env file");
    }
    options.UseNpgsql(connectionString);
});

// ============================================
// SERVICES & REPOSITORIES
// ============================================
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();


// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITenantRepository, TenantRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAddressService, AddressService>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ICouponService, CouponService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

builder.Services.AddScoped<IImageService, ImageService>();



// ============================================
// RAZORPAY CONFIGURATION
// ============================================
builder.Services.Configure<api.Infrastructure.Configuration.RazorpaySettings>(settings =>
{
    settings.KeyId = Environment.GetEnvironmentVariable("RAZORPAY_KEY_ID")
        ?? throw new Exception("RAZORPAY_KEY_ID not set in .env");
    settings.KeySecret = Environment.GetEnvironmentVariable("RAZORPAY_KEY_SECRET")
        ?? throw new Exception("RAZORPAY_KEY_SECRET not set in .env");
    settings.WebhookSecret = Environment.GetEnvironmentVariable("RAZORPAY_WEBHOOK_SECRET")
  ?? string.Empty;
    settings.Currency = Environment.GetEnvironmentVariable("RAZORPAY_CURRENCY") ?? "INR";
});


// ============================================
// FLUENT VALIDATION
// ============================================
builder.Services.AddFluentValidationAutoValidation(config =>
{
    config.DisableDataAnnotationsValidation = true;
});
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);

// ============================================
// CORS
// ============================================
var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? new[] { "http://localhost:3000", "http://localhost:3001" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ============================================
// JWT AUTHENTICATION
// ============================================
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? throw new Exception("JWT_SECRET not set");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "vitakart-api";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "vitakart-apps";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            NameClaimType = "sub",
            RoleClaimType = "role",
            ClockSkew = TimeSpan.FromMinutes(1) // Stricter than default 5 min
        };
    });

builder.Services.AddAuthorization();

// ============================================
// RATE LIMITING (Anti brute-force & DDoS)
// ============================================
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = 429;

    // Custom response when rate limit exceeded
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        context.HttpContext.Response.ContentType = "application/json";

        var retryAfter = context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retry)
            ? (int)retry.TotalSeconds
            : 60;

        context.HttpContext.Response.Headers.RetryAfter = retryAfter.ToString();

        var response = System.Text.Json.JsonSerializer.Serialize(new
        {
            success = false,
            statusCode = 429,
            message = "Too many requests. Please try again later.",
            retryAfterSeconds = retryAfter,
            timestamp = DateTime.UtcNow
        });

        await context.HttpContext.Response.WriteAsync(response, cancellationToken);
    };

    // GLOBAL policy — applies to all endpoints
    options.AddPolicy(RateLimitPolicies.Global, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientKey(httpContext),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = RateLimitPolicies.GetGlobalPermit(),
                Window = TimeSpan.FromSeconds(RateLimitPolicies.GetGlobalWindow()),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // AUTH policy — strict for login/register (anti brute-force)
    options.AddPolicy(RateLimitPolicies.Auth, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientKey(httpContext),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = RateLimitPolicies.GetAuthPermit(),
                Window = TimeSpan.FromSeconds(RateLimitPolicies.GetAuthWindow()),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // READ policy — higher limit for GET requests
    options.AddPolicy(RateLimitPolicies.Read, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientKey(httpContext),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = RateLimitPolicies.GetReadPermit(),
                Window = TimeSpan.FromSeconds(RateLimitPolicies.GetReadWindow()),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // WRITE policy — medium limit for POST/PUT/DELETE
    options.AddPolicy(RateLimitPolicies.Write, httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: GetClientKey(httpContext),
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = RateLimitPolicies.GetWritePermit(),
                Window = TimeSpan.FromSeconds(RateLimitPolicies.GetWriteWindow()),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

// Helper: Get client identifier (user ID if logged in, else IP)
static string GetClientKey(HttpContext context)
{
    var userId = context.User?.FindFirst("sub")?.Value;
    if (!string.IsNullOrEmpty(userId))
    {
        return $"user:{userId}";
    }
    return $"ip:{context.Connection.RemoteIpAddress?.ToString() ?? "unknown"}";
}

// ============================================
// HTTPS ENFORCEMENT (Production only)
// ============================================
if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddHsts(options =>
    {
        options.Preload = true;
        options.IncludeSubDomains = true;
        options.MaxAge = TimeSpan.FromDays(365);
    });

    builder.Services.AddHttpsRedirection(options =>
    {
        options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
        options.HttpsPort = 443;
    });
}

var app = builder.Build();

// ============================================
// SEED DATABASE (auto-create SuperAdmin)
// ============================================
await DatabaseSeeder.SeedAsync(app.Services);

// ============================================
// MIDDLEWARE PIPELINE (ORDER MATTERS!)
// ============================================

// 1. Forwarded headers (behind proxy support)
app.UseForwardedHeaders();

// 2. Security headers (add to all responses)
app.UseMiddleware<SecurityHeadersMiddleware>();

// 3. HTTPS + HSTS (production only)
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

// 4. Dev tools (Scalar UI + OpenAPI)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "Vitakart API";
        options.Theme = ScalarTheme.DeepSpace;
        options.DefaultHttpClient = new(ScalarTarget.JavaScript, ScalarClient.Fetch);
    });
}

// 5. Global exception handler (catch all errors)
app.UseMiddleware<GlobalExceptionMiddleware>();

// 6. Rate limiting (BEFORE auth to prevent bypass)
app.UseRateLimiter();

// 7. CORS
app.UseCors(CorsPolicyName);

// 8. Tenant resolver (BEFORE auth)
app.UseMiddleware<TenantResolverMiddleware>();

// 9. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// 10. Map controllers with global rate limit
app.MapControllers().RequireRateLimiting(RateLimitPolicies.Global);

app.Run();