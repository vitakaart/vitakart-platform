namespace api.Infrastructure.Configuration;

public class RazorpaySettings
{
    public string KeyId { get; set; } = string.Empty;
    public string KeySecret { get; set; } = string.Empty;
     public string WebhookSecret { get; set; } = string.Empty; 
    public string Currency { get; set; } = "INR";
}