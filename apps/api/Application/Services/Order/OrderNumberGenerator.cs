// File: apps/api/Application/Services/Order/Helpers/OrderNumberGenerator.cs
// Generates unique human-readable order numbers
// Format: ORD-2025-000001

using api.Application.Interfaces;

namespace api.Application.Services.Order.Helpers;

public class OrderNumberGenerator
{
    private readonly IUnitOfWork _unitOfWork;

    public OrderNumberGenerator(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Generate: ORD-{YEAR}-{6-digit-sequence}
    public async Task<string> GenerateAsync()
    {
        var year = DateTime.UtcNow.Year;
        var count = await _unitOfWork.Orders.GetOrderCountAsync();
        var sequence = (count + 1).ToString("D6");

        return $"ORD-{year}-{sequence}";
    }
}