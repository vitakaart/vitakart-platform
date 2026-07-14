// File: apps/api/API/Middleware/GlobalExceptionMiddleware.cs
// Catches ALL exceptions from anywhere in the app
// Returns consistent error response
// No more try-catch in controllers!

using api.Domain.Exceptions;
using System.Text.Json;

namespace api.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        // Log the exception
        _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

        // Default values
        var statusCode = 500;
        var message = "Something went wrong. Please try again.";

        // Handle custom exceptions
        if (exception is AppException appException)
        {
            statusCode = appException.StatusCode;
            message = appException.Message;
        }

        // Set response
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        // Send JSON response
        var response = new
        {
            success = false,
            statusCode,
            message,
            timestamp = DateTime.UtcNow
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}