// File: apps/api/Program.cs
// Added CORS configuration - clean & scalable

using api.API.Middleware;
using api.Application.Interfaces;
using api.Application.Services;
using api.Infrastructure.Data;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

Env.Load();

// Clear default claim mapping BEFORE anything else
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();

var builder = WebApplication.CreateBuilder(args);

// ============================================
// CORS POLICY NAME
// ============================================
const string CorsPolicyName = "VitakartCorsPolicy";

// ============================================
// REGISTER SERVICES
// ============================================

builder.Services.AddControllers();

builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

// OpenAPI/Scalar setup
builder.Services.AddOpenApi();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new Exception("DATABASE_URL not found in .env file");
    }
    options.UseNpgsql(connectionString);
});

// Application services
builder.Services.AddScoped<ITenantContext, TenantContext>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();

// ============================================
// CORS CONFIGURATION
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
              .AllowCredentials(); // Cookies ke liye future mein
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
            RoleClaimType = "role"
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();
// ============================================
// SEED DATABASE (auto-create SuperAdmin)
// ============================================
await DatabaseSeeder.SeedAsync(app.Services);

// ============================================
// MIDDLEWARE PIPELINE (Order matters!)
// ============================================

// 1. Development tools
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

// 2. Global exception handler (catches everything)
app.UseMiddleware<GlobalExceptionMiddleware>();

// 3. HTTPS redirect
app.UseHttpsRedirection();

// 4. CORS (before auth & routing)
app.UseCors(CorsPolicyName);

// 5. Tenant resolver (must be before auth)
app.UseMiddleware<TenantResolverMiddleware>();

// 6. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// 7. Map controllers
app.MapControllers();

app.Run();