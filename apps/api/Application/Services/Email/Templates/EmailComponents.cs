// apps/api/Infrastructure/Services/Email/Templates/EmailComponents.cs
namespace api.Infrastructure.Services.Email.Templates;

/// <summary>
/// Reusable email UI components.
/// Use these to build consistent, professional emails.
/// </summary>
public static class EmailComponents
{
    // ═══════════════════════════════════════════════════════
    // TYPOGRAPHY
    // ═══════════════════════════════════════════════════════

    /// <summary>Big page heading (h2)</summary>
    public static string Heading(string text)
    {
        return $"""
        <h2 style="margin:0 0 16px 0;color:{EmailStyles.TextPrimary};font-size:24px;font-weight:700;">
            {text}
        </h2>
        """;
    }

    /// <summary>Greeting line — "Hi John,"</summary>
    public static string Greeting(string userName)
    {
        return $"""
        <p style="margin:0 0 16px 0;color:{EmailStyles.TextPrimary};font-size:16px;line-height:1.6;">
            Hi <strong>{userName}</strong>,
        </p>
        """;
    }

    /// <summary>Regular paragraph text (muted)</summary>
    public static string Paragraph(string text)
    {
        return $"""
        <p style="margin:0 0 20px 0;color:{EmailStyles.TextSecondary};font-size:15px;line-height:1.6;">
            {text}
        </p>
        """;
    }

    /// <summary>Signature block — "Cheers, Team"</summary>
    public static string Signature(string message = "Happy shopping! 💚", string signOff = "The Vitakart Team")
    {
        return $"""
        <p style="margin:24px 0 0 0;color:{EmailStyles.TextSecondary};font-size:14px;line-height:1.6;">
            {message}<br>
            <strong style="color:{EmailStyles.TextPrimary};">{signOff}</strong>
        </p>
        """;
    }

    // ═══════════════════════════════════════════════════════
    // BUTTONS
    // ═══════════════════════════════════════════════════════

    /// <summary>Primary CTA button (emerald gradient)</summary>
    public static string PrimaryButton(string text, string url)
    {
        return $"""
        <div style="text-align:center;margin:32px 0;">
            <a href="{url}"
               style="display:inline-block;background:{EmailStyles.BrandGradient};color:#FFFFFF;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:{EmailStyles.ShadowButton};">
                {text}
            </a>
        </div>
        """;
    }

    // ═══════════════════════════════════════════════════════
    // ALERT BOXES
    // ═══════════════════════════════════════════════════════

    /// <summary>Success alert (green) — with left accent border</summary>
    public static string SuccessAlert(string title, string body, string icon = "✅")
    {
        return AlertBox(title, body, icon, EmailStyles.SuccessBg, EmailStyles.SuccessBorder, EmailStyles.SuccessText);
    }

    /// <summary>Warning alert (amber)</summary>
    public static string WarningAlert(string body, string icon = "⏰")
    {
        return $"""
        <div style="background:{EmailStyles.WarningBg};border-left:4px solid {EmailStyles.WarningBorder};padding:16px;border-radius:8px;margin:24px 0;">
            <p style="margin:0;color:{EmailStyles.WarningText};font-size:13px;line-height:1.5;">
                {icon} {body}
            </p>
        </div>
        """;
    }

    /// <summary>Danger alert (red)</summary>
    public static string DangerAlert(string body, string icon = "🛡️")
    {
        return $"""
        <div style="background:{EmailStyles.DangerBg};border-left:4px solid {EmailStyles.DangerBorder};padding:16px;border-radius:8px;margin:24px 0;">
            <p style="margin:0;color:{EmailStyles.DangerText};font-size:13px;line-height:1.5;">
                {icon} {body}
            </p>
        </div>
        """;
    }

    /// <summary>Info alert (blue)</summary>
    public static string InfoAlert(string body, string icon = "💡")
    {
        return $"""
        <div style="background:{EmailStyles.InfoBg};border-left:4px solid {EmailStyles.InfoBorder};padding:16px;border-radius:8px;margin:24px 0;">
            <p style="margin:0;color:{EmailStyles.InfoText};font-size:13px;line-height:1.5;">
                {icon} {body}
            </p>
        </div>
        """;
    }

    /// <summary>Soft success tip (no border, subtle)</summary>
    public static string SuccessTip(string body, string icon = "💡")
    {
        return $"""
        <div style="background:{EmailStyles.SuccessBg};border-radius:8px;padding:16px;margin:24px 0;">
            <p style="margin:0;color:{EmailStyles.SuccessText};font-size:13px;line-height:1.5;">
                {icon} {body}
            </p>
        </div>
        """;
    }

    /// <summary>Generic alert box (used internally)</summary>
    private static string AlertBox(string title, string body, string icon, string bg, string border, string textColor)
    {
        return $"""
        <div style="background:linear-gradient(135deg,{bg} 0%,{bg} 100%);border-left:4px solid {border};padding:20px;border-radius:8px;margin:24px 0;">
            <h3 style="margin:0 0 12px 0;color:{textColor};font-size:16px;font-weight:700;">
                {icon} {title}
            </h3>
            <div style="color:{EmailStyles.TextPrimary};font-size:14px;line-height:1.8;">
                {body}
            </div>
        </div>
        """;
    }

    // ═══════════════════════════════════════════════════════
    // FEATURE LIST (used in welcome email)
    // ═══════════════════════════════════════════════════════

    /// <summary>Bulleted feature list</summary>
    public static string FeatureList(params string[] items)
    {
        var listItems = string.Join("", items.Select(item => $"<li>{item}</li>"));
        return $"""
        <ul style="margin:0;padding:0 0 0 20px;color:{EmailStyles.TextPrimary};font-size:14px;line-height:1.8;">
            {listItems}
        </ul>
        """;
    }

    // ═══════════════════════════════════════════════════════
    // ORDER DETAILS TABLE
    // ═══════════════════════════════════════════════════════

    /// <summary>Order details card with order number + date</summary>
    public static string OrderHeaderCard(string orderNumber, DateTime orderDate)
    {
        return $"""
        <table role="presentation" style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:8px 0;">
                    {Label("Order Number")}
                    <p style="margin:4px 0 0 0;font-size:18px;color:{EmailStyles.TextPrimary};font-weight:700;font-family:monospace;">
                        {orderNumber}
                    </p>
                </td>
                <td style="padding:8px 0;text-align:right;">
                    {Label("Order Date")}
                    <p style="margin:4px 0 0 0;font-size:14px;color:{EmailStyles.TextPrimary};font-weight:600;">
                        {orderDate:d MMM yyyy}
                    </p>
                </td>
            </tr>
        </table>
        """;
    }

    /// <summary>Order summary rows (items, payment, total)</summary>
    public static string OrderSummaryRows(int totalItems, string paymentMethod, decimal total)
    {
        var itemsText = totalItems > 1 ? "items" : "item";
        return $"""
        <table role="presentation" style="width:100%;border-collapse:collapse;">
            {SummaryRow("Items:", $"{totalItems} {itemsText}")}
            {SummaryRow("Payment:", paymentMethod)}
            <tr>
                <td style="padding:12px 0 0 0;border-top:2px solid {EmailStyles.BorderLight};color:{EmailStyles.TextPrimary};font-size:16px;font-weight:700;">
                    Total Amount:
                </td>
                <td style="padding:12px 0 0 0;border-top:2px solid {EmailStyles.BorderLight};text-align:right;color:{EmailStyles.BrandPrimary};font-size:20px;font-weight:800;">
                    ₹{total:N2}
                </td>
            </tr>
        </table>
        """;
    }

    /// <summary>Card wrapper with subtle background</summary>
    public static string Card(string content)
    {
        return $"""
        <div style="background:{EmailStyles.BgSubtle};border-radius:12px;padding:24px;margin:24px 0;">
            {content}
        </div>
        """;
    }

    /// <summary>Bordered card (outlined, no fill)</summary>
    public static string OutlinedCard(string title, string content, string icon = "📍")
    {
        return $"""
        <div style="border:1px solid {EmailStyles.BorderLight};border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px 0;font-size:12px;color:{EmailStyles.TextSecondary};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                {icon} {title}
            </p>
            <p style="margin:0;color:{EmailStyles.TextPrimary};font-size:14px;line-height:1.6;">
                {content}
            </p>
        </div>
        """;
    }

    /// <summary>Horizontal divider</summary>
    public static string Divider()
    {
        return $"""<hr style="border:none;border-top:1px solid {EmailStyles.BorderLight};margin:16px 0;">""";
    }

    // ═══════════════════════════════════════════════════════
    // URL DISPLAY (for password reset)
    // ═══════════════════════════════════════════════════════

    /// <summary>Displays a URL in a copy-friendly box</summary>
    public static string UrlBox(string url)
    {
        return $"""
        <p style="margin:20px 0 8px 0;color:{EmailStyles.TextSecondary};font-size:13px;line-height:1.6;">
            Or copy and paste this URL in your browser:
        </p>
        <p style="margin:0 0 24px 0;padding:12px;background:{EmailStyles.BgSubtle};border-radius:8px;word-break:break-all;">
            <a href="{url}" style="color:{EmailStyles.BrandPrimary};font-size:12px;text-decoration:none;font-family:monospace;">
                {url}
            </a>
        </p>
        """;
    }

    // ═══════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════

    /// <summary>Small uppercase label</summary>
    public static string Label(string text)
    {
        return $"""
        <p style="margin:0;font-size:12px;color:{EmailStyles.TextSecondary};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
            {text}
        </p>
        """;
    }

    /// <summary>Summary row (label + value)</summary>
    private static string SummaryRow(string label, string value)
    {
        return $"""
        <tr>
            <td style="padding:6px 0;color:{EmailStyles.TextSecondary};font-size:14px;">{label}</td>
            <td style="padding:6px 0;text-align:right;color:{EmailStyles.TextPrimary};font-size:14px;font-weight:600;">
                {value}
            </td>
        </tr>
        """;
    }

    /// <summary>Get frontend URL from env or fallback</summary>
    public static string GetFrontendUrl()
    {
        return Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:3000";
    }
}