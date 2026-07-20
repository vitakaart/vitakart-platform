// File: apps/api/Application/Interfaces/IOrderService.cs

using api.Application.DTOs.Order;
using api.Domain.Enums;

namespace api.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(Guid userId, CreateOrderDto dto);
    Task<OrderDto> GetOrderByIdAsync(Guid userId, Guid orderId);
    Task<OrderDto> GetOrderByNumberAsync(Guid userId, string orderNumber);

    // UPDATED — Added date filters
    Task<PaginatedOrdersDto> GetUserOrdersAsync(
        Guid userId,
        int page = 1,
        int pageSize = 10,
        OrderStatus? statusFilter = null,
        DateTime? fromDate = null,
        DateTime? toDate = null
    );

    Task<OrderDto> CancelOrderAsync(Guid userId, Guid orderId, string? reason = null);
}