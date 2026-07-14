// File: apps/api/Application/DTOs/TenantDto.cs
// This is what we send in API responses
// We don't send full entity — only needed fields
// Cleaner and safer for frontend

namespace api.Application.DTOs;

public class TenantDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? LogoUrl { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Plan { get; set; } = string.Empty;
    public string? ContactEmail { get; set; }
    public DateTime CreatedAt { get; set; }
}

// DTO for creating a new tenant (input)
// Only fields user needs to provide
public class CreateTenantDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Domain { get; set; }
    public string? ContactEmail { get; set; }
}