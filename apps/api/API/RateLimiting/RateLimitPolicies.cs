// File: apps/api/API/RateLimiting/RateLimitPolicies.cs
// Centralized rate limit policy names & configuration
// All values come from .env for easy tuning

namespace api.API.RateLimiting;

public static class RateLimitPolicies
{
    // ==========================================
    // POLICY NAMES (used in [EnableRateLimiting])
    // ==========================================
    public const string Global = "global";
    public const string Auth = "auth";
    public const string Read = "read";
    public const string Write = "write";

    // ==========================================
    // CONFIG HELPERS (read from .env)
    // ==========================================

    // Global limit — applied to all endpoints
    public static int GetGlobalPermit() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_GLOBAL_PERMIT") ?? "100");

    public static int GetGlobalWindow() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_GLOBAL_WINDOW_SECONDS") ?? "60");

    // Auth limit — strict for login/register (anti brute-force)
    public static int GetAuthPermit() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_AUTH_PERMIT") ?? "5");

    public static int GetAuthWindow() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_AUTH_WINDOW_SECONDS") ?? "60");

    // Read limit — higher for GET requests
    public static int GetReadPermit() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_READ_PERMIT") ?? "200");

    public static int GetReadWindow() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_READ_WINDOW_SECONDS") ?? "60");

    // Write limit — medium for POST/PUT/DELETE
    public static int GetWritePermit() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_WRITE_PERMIT") ?? "30");

    public static int GetWriteWindow() =>
        int.Parse(Environment.GetEnvironmentVariable("RATE_LIMIT_WRITE_WINDOW_SECONDS") ?? "60");
}