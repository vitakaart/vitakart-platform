// apps/api/Infrastructure/Services/Email/Templates/EmailBase.cs
namespace api.Infrastructure.Services.Email.Templates;

/// <summary>
/// Base HTML wrapper for all emails.
/// Provides consistent header, footer, and page structure.
/// </summary>
public static class EmailBase
{
    /// <summary>
    /// Wraps body content in the full email HTML structure.
    /// </summary>
    public static string Wrap(string title, string bodyContent)
    {
        return $$"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{title}}</title>
        </head>
        <body style="margin:0;padding:0;font-family:{{EmailStyles.FontFamily}};background-color:{{EmailStyles.BgPage}};color:{{EmailStyles.TextPrimary}};">
            <table role="presentation" style="width:100%;border-collapse:collapse;background-color:{{EmailStyles.BgPage}};padding:40px 20px;">
                <tr>
                    <td align="center">
                        <table role="presentation" style="max-width:600px;width:100%;background-color:{{EmailStyles.BgCard}};border-radius:16px;overflow:hidden;box-shadow:{{EmailStyles.ShadowCard}};">
                            {{RenderHeader()}}
                            <tr>
                                <td style="padding:40px;">
                                    {{bodyContent}}
                                </td>
                            </tr>
                            {{RenderFooter()}}
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """;
    }

    /// <summary>
    /// Renders the branded header section.
    /// </summary>
    private static string RenderHeader()
    {
        return $$"""
        <tr>
            <td style="background:{{EmailStyles.BrandGradient}};padding:32px 40px;text-align:center;">
                <h1 style="margin:0;color:#FFFFFF;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
                    🌿 Vitakart
                </h1>
                <p style="margin:8px 0 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                    Your Wellness Partner
                </p>
            </td>
        </tr>
        """;
    }

    /// <summary>
    /// Renders the footer with contact info and copyright.
    /// </summary>
    private static string RenderFooter()
    {
        return $$"""
        <tr>
            <td style="background-color:{{EmailStyles.BgFooter}};padding:32px 40px;text-align:center;border-top:1px solid {{EmailStyles.BorderLight}};">
                <p style="margin:0 0 8px 0;font-size:12px;color:{{EmailStyles.TextSecondary}};">
                    Need help? Contact us at
                    <a href="mailto:support@vitakart.com" style="color:{{EmailStyles.BrandPrimary}};text-decoration:none;font-weight:600;">
                        support@vitakart.com
                    </a>
                </p>
                <p style="margin:0;font-size:11px;color:{{EmailStyles.TextSecondary}};">
                    © {{DateTime.UtcNow.Year}} Vitakart. All rights reserved.
                </p>
            </td>
        </tr>
        """;
    }
}