// File: apps/api/Application/DTOs/Order/OrderListDto.cs

using api.Domain.Enums;

namespace api.Application.DTOs.Order;

public class OrderListDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;

    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }

    public decimal Total { get; set; }

    public int TotalItems { get; set; }

    public DateTime CreatedAt { get; set; }
}