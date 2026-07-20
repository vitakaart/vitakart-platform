// File: apps/api/Infrastructure/Repositories/OrderRepository.cs
// Order repository — optimized queries with eager loading

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Domain.Enums;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext) { }

    // ==========================================
    // GET ORDER WITH FULL DETAILS
    // ==========================================
    public async Task<Order?> GetOrderWithItemsAsync(Guid orderId)
    {
        return await Query()
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == orderId);
    }

    // ==========================================
    // GET BY ORDER NUMBER
    // ==========================================
    public async Task<Order?> GetByOrderNumberAsync(string orderNumber)
    {
        return await Query()
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
    }

    // ==========================================
    // GET USER ORDERS (Paginated)
    // ==========================================
    // ==========================================
    // GET USER ORDERS (Paginated + Date Filter)
    // ==========================================
    public async Task<(List<Order> Orders, int TotalCount)> GetUserOrdersAsync(
        Guid userId,
        int page = 1,
        int pageSize = 10,
        OrderStatus? statusFilter = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = Query()
            .Where(o => o.UserId == userId);

        // Apply status filter
        if (statusFilter.HasValue)
        {
            query = query.Where(o => o.Status == statusFilter.Value);
        }

        // Apply date range filter
        if (fromDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= fromDate.Value);
        }

        if (toDate.HasValue)
        {
            // Include full day (till 23:59:59)
            var endOfDay = toDate.Value.Date.AddDays(1).AddTicks(-1);
            query = query.Where(o => o.CreatedAt <= endOfDay);
        }

        var totalCount = await query.CountAsync();

        var orders = await query
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (orders, totalCount);
    }

    // ==========================================
    // GET ALL ORDERS — ADMIN (Paginated + Filters)
    // ==========================================
    public async Task<(List<Order> Orders, int TotalCount)> GetAllOrdersAsync(
        int page = 1,
        int pageSize = 20,
        OrderStatus? statusFilter = null,
        PaymentStatus? paymentStatusFilter = null,
        string? searchTerm = null)
    {
        var query = Query();

        // Status filter
        if (statusFilter.HasValue)
        {
            query = query.Where(o => o.Status == statusFilter.Value);
        }

        // Payment status filter
        if (paymentStatusFilter.HasValue)
        {
            query = query.Where(o => o.PaymentStatus == paymentStatusFilter.Value);
        }

        // Search by order number, customer name, or phone
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(o =>
                o.OrderNumber.ToLower().Contains(term) ||
                o.ShippingFullName.ToLower().Contains(term) ||
                o.ShippingPhone.Contains(term)
            );
        }

        // Total count
        var totalCount = await query.CountAsync();

        // Paginated results
        var orders = await query
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (orders, totalCount);
    }

    // ==========================================
    // IDEMPOTENCY CHECK
    // ==========================================
    public async Task<Order?> GetByIdempotencyKeyAsync(string idempotencyKey, Guid userId)
    {
        return await Query()
            .Include(o => o.Items.Where(i => !i.IsDeleted))
            .FirstOrDefaultAsync(o =>
                o.IdempotencyKey == idempotencyKey &&
                o.UserId == userId);
    }

    // ==========================================
    // ORDER COUNT (for generating order number)
    // ==========================================
    public async Task<int> GetOrderCountAsync()
    {
        // Count ALL orders (including deleted) for unique numbering
        return await QueryUnfiltered()
            .CountAsync();
    }

    // ==========================================
    // ADD ORDER ITEM
    // ==========================================
    public async Task AddOrderItemAsync(OrderItem item)
    {
        // Auto-set TenantId
        if (_tenantContext.IsResolved && item.TenantId == Guid.Empty)
        {
            item.TenantId = _tenantContext.TenantId!.Value;
        }

        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.Set<OrderItem>().AddAsync(item);
    }
}