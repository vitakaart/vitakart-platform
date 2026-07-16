// File: apps/api/API/Middleware/SecurityHeadersMiddleware.cs
// Adds security headers to every HTTP response
// Protects from: XSS, clickjacking, MIME sniffing, MITM attacks

namespace api.API.Middleware;

public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;

        // Prevent clickjacking attacks (site can't be embedded in iframe)
        headers.Append("X-Frame-Options", "DENY");

        // Prevent MIME type sniffing (browsers must trust declared content-type)
        headers.Append("X-Content-Type-Options", "nosniff");

        // XSS protection (legacy but harmless)
        headers.Append("X-XSS-Protection", "1; mode=block");

        // Referrer policy (control what referrer info is sent)
        headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions policy (disable unused browser features)
        headers.Append("Permissions-Policy",
            "camera=(), microphone=(), geolocation=(), payment=()");

        // Content Security Policy (prevent XSS by controlling resource loading)
        headers.Append("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self';");

        // HSTS (force HTTPS for 1 year — only in production over HTTPS)
        if (context.Request.IsHttps)
        {
            headers.Append("Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload");
        }

        // Remove server version disclosure (security through obscurity)
        headers.Remove("Server");
        headers.Remove("X-Powered-By");

        await _next(context);
    }
}