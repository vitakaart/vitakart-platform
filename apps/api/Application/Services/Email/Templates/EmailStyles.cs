// apps/api/Infrastructure/Services/Email/Templates/EmailStyles.cs
namespace api.Infrastructure.Services.Email.Templates;

/// <summary>
/// Design tokens for email templates.
/// Keeps colors, spacing, and styles consistent across all emails.
/// </summary>
public static class EmailStyles
{
    // ─── Brand Colors ───
    public const string BrandPrimary = "#10B981";       // Emerald
    public const string BrandPrimaryDark = "#059669";
    public const string BrandGradient = "linear-gradient(135deg,#10B981 0%,#059669 100%)";

    // ─── Neutrals ───
    public const string TextPrimary = "#0A0A0A";
    public const string TextSecondary = "#6B665D";
    public const string TextMuted = "#9CA3AF";

    // ─── Backgrounds ───
    public const string BgPage = "#FEFBF3";              // Warm off-white
    public const string BgCard = "#FFFFFF";
    public const string BgSubtle = "#F5F1E8";
    public const string BgFooter = "#F5F1E8";

    // ─── Borders ───
    public const string BorderLight = "#E9E1D2";

    // ─── Status Colors ───
    public const string SuccessBg = "#ECFDF5";
    public const string SuccessBorder = "#10B981";
    public const string SuccessText = "#059669";

    public const string WarningBg = "#FEF3C7";
    public const string WarningBorder = "#F59E0B";
    public const string WarningText = "#92400E";

    public const string DangerBg = "#FEE2E2";
    public const string DangerBorder = "#EF4444";
    public const string DangerText = "#991B1B";

    public const string InfoBg = "#DBEAFE";
    public const string InfoBorder = "#3B82F6";
    public const string InfoText = "#1E40AF";

    // ─── Font ───
    public const string FontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif";

    // ─── Shadows ───
    public const string ShadowCard = "0 4px 20px rgba(0,0,0,0.05)";
    public const string ShadowButton = "0 4px 12px rgba(16,185,129,0.3)";
}