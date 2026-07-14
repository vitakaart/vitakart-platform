// File: apps/api/Program.cs
// Entry point of our API
// Now with .env file support for database connection

using api.Infrastructure.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;

// Load .env file — must be done BEFORE builder is created
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ============================================
// REGISTER SERVICES
// ============================================

// Add controllers support
builder.Services.AddControllers();
// Enable lowercase URLs
builder.Services.Configure<Microsoft.AspNetCore.Routing.RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

// Add OpenAPI/Swagger for API docs
builder.Services.AddOpenApi();

// Register PostgreSQL database
// Read DATABASE_URL from .env file
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
// BUILD THE APP
// ============================================

var app = builder.Build();

// ============================================
// CONFIGURE MIDDLEWARE
// ============================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();