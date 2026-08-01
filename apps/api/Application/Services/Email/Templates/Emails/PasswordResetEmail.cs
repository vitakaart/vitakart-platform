// apps/api/Infrastructure/Services/Email/Templates/Emails/PasswordResetEmail.cs
namespace api.Infrastructure.Services.Email.Templates.Emails;

/// <summary>
/// Password reset email with time-limited reset link.
/// </summary>
public static class PasswordResetEmail
{
    public static string Build(string userName, string resetUrl)
    {
        var body = string.Concat(
            EmailComponents.Heading("Reset Your Password 🔐"),
            EmailComponents.Greeting(userName),
            EmailComponents.Paragraph(
                "We received a request to reset the password for your Vitakart account. Click the button below to create a new password."
            ),
            EmailComponents.PrimaryButton("Reset Password", resetUrl),
            EmailComponents.WarningAlert("<strong>This link expires in 15 minutes</strong> for security reasons."),
            EmailComponents.UrlBox(resetUrl),
            EmailComponents.DangerAlert("<strong>Didn't request this?</strong> You can safely ignore this email. Your password won't be changed."),
            EmailComponents.Signature("Stay secure,")
        );

        return EmailBase.Wrap("Reset Your Password", body);
    }
}