// apps/api/Infrastructure/Services/Email/EmailTemplates.cs
// Thin orchestrator — delegates to modular templates

using api.Application.Interfaces;
using api.Infrastructure.Services.Email.Templates.Emails;

namespace api.Infrastructure.Services.Email;

/// <summary>
/// Entry point for all email templates.
/// Delegates to modular templates in Templates/Emails/.
/// </summary>
public static class EmailTemplates
{
    public static string WelcomeEmail(string userName)
        => Templates.Emails.WelcomeEmail.Build(userName);

    public static string PasswordResetEmail(string userName, string resetUrl)
        => Templates.Emails.PasswordResetEmail.Build(userName, resetUrl);

    public static string OrderPlacedEmail(string userName, OrderEmailData order)
        => Templates.Emails.OrderPlacedEmail.Build(userName, order);

    public static string OrderCancelledEmail(string userName, OrderEmailData order)
        => Templates.Emails.OrderCancelledEmail.Build(userName, order);
    public static string OrderShippedEmail(string userName, string orderNumber, string trackingUrl)
=> Templates.Emails.OrderShippedEmail.Build(userName, orderNumber, trackingUrl);
}