// File: apps/api/Application/Interfaces/IEmailService.cs
// Email service contract

namespace api.Application.Interfaces;

public interface IEmailService
{
    // Generic email sender
    Task<bool> SendEmailAsync(
        string toEmail,
        string toName,
        string subject,
        string htmlBody,
        string? plainText = null);

    // Specific email types
    Task<bool> SendWelcomeEmailAsync(string toEmail, string toName);
    Task<bool> SendPasswordResetEmailAsync(string toEmail, string toName, string resetUrl);
    Task<bool> SendOrderPlacedEmailAsync(string toEmail, string toName, OrderEmailData orderData);
    Task<bool> SendOrderCancelledEmailAsync(string toEmail, string toName, OrderEmailData orderData);
}

// Data class for order emails
public class OrderEmailData
{
    public string OrderNumber { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int TotalItems { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public string OrderUrl { get; set; } = string.Empty;
    public string? CancellationReason { get; set; }
}