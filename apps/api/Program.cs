// File: apps/api/Program.cs
// Entry point with JWT authentication configured

using api.API.Middleware;
using api.Application.Interfaces;
using api.Application.Services;
using api.Infrastructure.Data;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ============================================
// REGISTER SERVICES
// ============================================

builder.Services.AddControllers();

builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Services.AddOpenApi();

// PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new Exception("DATABASE_URL not found in .env file");
    }
    options.UseNpgsql(connectionString);
});

// Tenant Context
builder.Services.AddScoped<ITenantContext, TenantContext>();

// JWT & Auth Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Authentication Configuration
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// ============================================
// BUILD APP
// ============================================

var app = builder.Build();

// ============================================
// MIDDLEWARE (ORDER MATTERS!)
// ============================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Tenant middleware first
app.UseMiddleware<TenantResolverMiddleware>();

// Then auth middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();