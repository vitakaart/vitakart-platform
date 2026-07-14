// File: apps/api/Domain/Entities/Tenant.cs
// This is the main tenant table
// Every brand (Vitakart, NutriNest, etc.) will be one row here
// All other data (products, orders) will belong to a tenant

using api.Domain.Common;

namespace api.Domain.Entities;

public class Tenant : BaseEntity
{
    // Brand name — e.g., "Vitakart"
    public string Name { get; set; } = string.Empty;

    // URL-friendly name — e.g., "vitakart"
    // Used for subdomain: vitakart.ourplatform.com
    public string Slug { get; set; } = string.Empty;

    // Custom domain — e.g., "www.vitakart.com"
    public string? Domain { get; set; }

    // Brand logo URL
    public string? LogoUrl { get; set; }

    // Status: active, inactive, suspended
    public string Status { get; set; } = "active";

    // Plan: free, basic, pro, enterprise
    public string Plan { get; set; } = "free";

    // Contact email of tenant owner
    public string? ContactEmail { get; set; }
}