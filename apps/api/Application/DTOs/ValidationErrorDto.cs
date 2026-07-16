// File: apps/api/Application/DTOs/ValidationErrorDto.cs
// Standard validation error response format

namespace api.Application.DTOs;

public class ValidationErrorDto
{
    public string Message { get; set; } = "Validation failed";
    public Dictionary<string, List<string>> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}