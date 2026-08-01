// apps/api/Infrastructure/Services/Email/Templates/Emails/OrderPlacedEmail.cs
using api.Application.Interfaces;

namespace api.Infrastructure.Services.Email.Templates.Emails;

/// <summary>
/// Order confirmation email sent after successful order placement.
/// </summary>
public static class OrderPlacedEmail
{
    public static string Build(string userName, OrderEmailData order)
    {
        // Build order details card content
        var orderCardContent = string.Concat(
            EmailComponents.OrderHeaderCard(order.OrderNumber, order.OrderDate),
            EmailComponents.Divider(),
            EmailComponents.OrderSummaryRows(order.TotalItems, order.PaymentMethod, order.Total)
        );

        var body = string.Concat(
            EmailComponents.Heading("Order Confirmed! 🎉"),
            EmailComponents.Greeting(userName),
            EmailComponents.Paragraph(
                "Thank you for your order! We're preparing your wellness products with care and will notify you once they're on the way."
            ),
            EmailComponents.Card(orderCardContent),
            EmailComponents.OutlinedCard("Shipping To", order.ShippingAddress, "📍"),
            EmailComponents.PrimaryButton("Track Your Order", order.OrderUrl),
            EmailComponents.SuccessTip("<strong>What's next?</strong> We'll email you when your order ships with tracking details."),
            EmailComponents.Signature("Thank you for choosing us! 💚")
        );

        return EmailBase.Wrap($"Order Confirmed - {order.OrderNumber}", body);
    }
}