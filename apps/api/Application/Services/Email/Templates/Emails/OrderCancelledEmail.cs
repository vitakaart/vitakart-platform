// apps/api/Infrastructure/Services/Email/Templates/Emails/OrderCancelledEmail.cs
using api.Application.Interfaces;

namespace api.Infrastructure.Services.Email.Templates.Emails;

/// <summary>
/// Order cancellation confirmation email.
/// </summary>
public static class OrderCancelledEmail
{
    public static string Build(string userName, OrderEmailData order)
    {
        // Build order summary rows (without payment method for cancelled)
        var orderCardContent = $"""
        <table role="presentation" style="width:100%;border-collapse:collapse;">
            <tr>
                <td style="padding:6px 0;color:{EmailStyles.TextSecondary};font-size:14px;">Order Number:</td>
                <td style="padding:6px 0;text-align:right;color:{EmailStyles.TextPrimary};font-size:14px;font-weight:600;font-family:monospace;">
                    {order.OrderNumber}
                </td>
            </tr>
            <tr>
                <td style="padding:6px 0;color:{EmailStyles.TextSecondary};font-size:14px;">Items:</td>
                <td style="padding:6px 0;text-align:right;color:{EmailStyles.TextPrimary};font-size:14px;font-weight:600;">
                    {order.TotalItems}
                </td>
            </tr>
            <tr>
                <td style="padding:6px 0;color:{EmailStyles.TextSecondary};font-size:14px;">Amount:</td>
                <td style="padding:6px 0;text-align:right;color:{EmailStyles.TextPrimary};font-size:14px;font-weight:600;">
                    ₹{order.Total:N2}
                </td>
            </tr>
        </table>
        """;

        var body = string.Concat(
            EmailComponents.Heading("Order Cancelled"),
            EmailComponents.Greeting(userName),
            EmailComponents.Paragraph(
                $"Your order <strong style=\"color:{EmailStyles.TextPrimary};font-family:monospace;\">{order.OrderNumber}</strong> has been cancelled successfully."
            ),
            RenderCancellationReason(order.CancellationReason),
            EmailComponents.Card(orderCardContent),
            EmailComponents.InfoAlert("<strong>Refund Info:</strong> If payment was made, refund will be processed within 5-7 business days.", "💰"),
            EmailComponents.PrimaryButton("Continue Shopping", EmailComponents.GetFrontendUrl()),
            EmailComponents.Signature("Sorry for any inconvenience.")
        );

        return EmailBase.Wrap($"Order Cancelled - {order.OrderNumber}", body);
    }

    /// <summary>Renders cancellation reason box (only if reason exists)</summary>
    private static string RenderCancellationReason(string? reason)
    {
        if (string.IsNullOrEmpty(reason)) return string.Empty;

        return $"""
        <div style="background:{EmailStyles.DangerBg};border-left:4px solid {EmailStyles.DangerBorder};padding:16px;border-radius:8px;margin:20px 0;">
            <p style="margin:0 0 4px 0;font-size:12px;color:{EmailStyles.DangerText};font-weight:600;text-transform:uppercase;letter-spacing:1px;">
                Reason
            </p>
            <p style="margin:0;color:{EmailStyles.DangerText};font-size:14px;line-height:1.5;">
                {reason}
            </p>
        </div>
        """;
    }
}