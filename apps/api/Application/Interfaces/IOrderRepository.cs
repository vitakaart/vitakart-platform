// File: apps/api/Application/Interfaces/IOrderRepository.cs

using api.Domain.Entities;
using api.Domain.Enums;

namespace api.Application.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetOrderWithItemsAsync(Guid orderId);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);

    // UPDATED — Added date filters
    Task<(List<Order> Orders, int TotalCount)> GetUserOrdersAsync(
        Guid userId,
        int page = 1,
        int pageSize = 10,
        OrderStatus? statusFilter = null,
        DateTime? fromDate = null,
        DateTime? toDate = null
    );

    Task<(List<Order> Orders, int TotalCount)> GetAllOrdersAsync(
        int page = 1,
        int pageSize = 20,
        OrderStatus? statusFilter = null,
        PaymentStatus? paymentStatusFilter = null,
        string? searchTerm = null
    );

    Task<Order?> GetByIdempotencyKeyAsync(string idempotencyKey, Guid userId);
    Task<int> GetOrderCountAsync();
    Task AddOrderItemAsync(OrderItem item);
}