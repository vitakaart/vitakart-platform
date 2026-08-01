// File: apps/api/Infrastructure/Services/Email/EmailService.cs
// MailKit-based email sender (Gmail SMTP)

using api.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace api.Infrastructure.Services.Email;

public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;

    // Config from environment
    private static string SmtpHost => Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
    private static int SmtpPort => int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587");
    private static string SmtpUsername => Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? "";
    private static string SmtpPassword => Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "";
    private static string FromEmail => Environment.GetEnvironmentVariable("SMTP_FROM_EMAIL") ?? "";
    private static string FromName => Environment.GetEnvironmentVariable("SMTP_FROM_NAME") ?? "Vitakart";

    public EmailService(ILogger<EmailService> logger)
    {
        _logger = logger;
    }

    // ==========================================
    // GENERIC EMAIL SENDER
    // ==========================================
    public async Task<bool> SendEmailAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        string? plainText = null)
    {
        // Validate config
        if (string.IsNullOrEmpty(SmtpUsername) || string.IsNullOrEmpty(SmtpPassword))
        {
            _logger.LogWarning("⚠️  Email not sent — SMTP credentials not configured");
            _logger.LogInformation("📧 Would send to: {Email} | Subject: {Subject}", toEmail, subject);
            return false;
        }

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(FromName, FromEmail));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = htmlBody,
                TextBody = plainText ?? StripHtml(htmlBody)
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();

            // Connect with STARTTLS (Gmail standard)
            await client.ConnectAsync(SmtpHost, SmtpPort, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(SmtpUsername, SmtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation("✅ Email sent to {Email} — {Subject}", toEmail, subject);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Failed to send email to {Email}: {Message}", toEmail, ex.Message);
            return false;
        }
    }

    // ==========================================
    // WELCOME EMAIL
    // ==========================================
    public Task<bool> SendWelcomeEmailAsync(string toEmail, string toName)
    {
        var html = EmailTemplates.WelcomeEmail(toName);
        return SendEmailAsync(toEmail, toName, "Welcome to Vitakart! 🎉", html);
    }

    // ==========================================
    // PASSWORD RESET EMAIL
    // ==========================================
    public Task<bool> SendPasswordResetEmailAsync(string toEmail, string toName, string resetUrl)
    {
        var html = EmailTemplates.PasswordResetEmail(toName, resetUrl);
        return SendEmailAsync(toEmail, toName, "Reset Your Vitakart Password", html);
    }

    // ==========================================
    // ORDER PLACED EMAIL
    // ==========================================
    public Task<bool> SendOrderPlacedEmailAsync(string toEmail, string toName, OrderEmailData orderData)
    {
        var html = EmailTemplates.OrderPlacedEmail(toName, orderData);
        return SendEmailAsync(toEmail, toName, $"Order Confirmed - {orderData.OrderNumber}", html);
    }

    // ==========================================
    // ORDER CANCELLED EMAIL
    // ==========================================
    public Task<bool> SendOrderCancelledEmailAsync(string toEmail, string toName, OrderEmailData orderData)
    {
        var html = EmailTemplates.OrderCancelledEmail(toName, orderData);
        return SendEmailAsync(toEmail, toName, $"Order Cancelled - {orderData.OrderNumber}", html);
    }

    // ==========================================
    // HELPER — Strip HTML for plain text version
    // ==========================================
    private static string StripHtml(string html)
    {
        return System.Text.RegularExpressions.Regex
            .Replace(html, "<.*?>", string.Empty)
            .Trim();
    }
}