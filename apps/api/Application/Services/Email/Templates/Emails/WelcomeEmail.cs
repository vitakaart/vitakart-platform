// apps/api/Infrastructure/Services/Email/Templates/Emails/WelcomeEmail.cs
namespace api.Infrastructure.Services.Email.Templates.Emails;

/// <summary>
/// Welcome email sent when a user registers.
/// </summary>
public static class WelcomeEmail
{
    public static string Build(string userName)
    {
        var featureList = EmailComponents.FeatureList(
            "Explore 1000+ health products",
            $"Get 10% off with code <strong style=\"color:{EmailStyles.SuccessText};\">WELCOME10</strong>",
            "Free shipping on orders above ₹499",
            "100% authentic products guaranteed"
        );

        var body = string.Concat(
            EmailComponents.Heading("Welcome to Vitakart! 🎉"),
            EmailComponents.Greeting(userName),
            EmailComponents.Paragraph(
                "Thank you for joining Vitakart — India's trusted destination for premium health and wellness products! We're thrilled to have you on board."
            ),
            EmailComponents.SuccessAlert("Get Started", featureList, "🎁"),
            EmailComponents.PrimaryButton("Start Shopping →", EmailComponents.GetFrontendUrl()),
            EmailComponents.Signature("Happy shopping! 💚")
        );

        return EmailBase.Wrap("Welcome to Vitakart", body);
    }
}