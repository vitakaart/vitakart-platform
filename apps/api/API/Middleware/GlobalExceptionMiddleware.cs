// File: apps/api/API/Middleware/GlobalExceptionMiddleware.cs
// Updated: Now handles FluentValidation errors too
// Returns consistent error response with field-level errors

using api.Application.DTOs;
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
        context.Response.ContentType = "application/json";

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // ==========================================
        // 1. FluentValidation errors (400 with details)
        // ==========================================
        if (exception is FluentValidation.ValidationException fluentValidationEx)
        {
            context.Response.StatusCode = 400;

            var errors = fluentValidationEx.Errors
                .GroupBy(e => ToCamelCase(e.PropertyName))
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToList()
                );

            var validationResponse = new
            {
                success = false,
                statusCode = 400,
                message = "Validation failed",
                errors,
                timestamp = DateTime.UtcNow
            };

            _logger.LogWarning("Validation failed: {@Errors}", errors);

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(validationResponse, jsonOptions));
            return;
        }

        // ==========================================
        // 2. Custom AppException handling
        // ==========================================
        _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

        var statusCode = 500;
        var message = "Something went wrong. Please try again.";

        if (exception is AppException appException)
        {
            statusCode = appException.StatusCode;
            message = appException.Message;
        }

        context.Response.StatusCode = statusCode;

        var response = new
        {
            success = false,
            statusCode,
            message,
            timestamp = DateTime.UtcNow
        };

        var json = JsonSerializer.Serialize(response, jsonOptions);
        await context.Response.WriteAsync(json);
    }

    // Helper to convert property names to camelCase for frontend
    private static string ToCamelCase(string str)
    {
        if (string.IsNullOrEmpty(str)) return str;
        return char.ToLowerInvariant(str[0]) + str[1..];
    }
}