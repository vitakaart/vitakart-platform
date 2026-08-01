namespace api.Infrastructure.Services.Email.Templates.Emails;

public static class OrderShippedEmail
{
    public static string Build(string userName, string orderNumber, string trackingUrl)
    {
        var body = string.Concat(
            EmailComponents.Heading("Your Order is on the Way! 📦"),
            EmailComponents.Greeting(userName),
            EmailComponents.Paragraph($"Great news! Your order <strong>{orderNumber}</strong> has been shipped."),
            EmailComponents.PrimaryButton("Track Package", trackingUrl),
            EmailComponents.InfoAlert("Delivery expected in 3-5 business days."),
            EmailComponents.Signature()
        );

        return EmailBase.Wrap($"Order Shipped - {orderNumber}", body);
    }
}