// File: apps/api/Application/DTOs/Order/CancelOrderDto.cs
// Input DTO for order cancellation

namespace api.Application.DTOs.Order;

public class CancelOrderDto
{
    public string? Reason { get; set; }
}