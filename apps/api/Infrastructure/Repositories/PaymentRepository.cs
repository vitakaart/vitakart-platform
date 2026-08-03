// File: apps/api/Infrastructure/Repositories/PaymentRepository.cs

using api.Application.Interfaces;
using api.Domain.Entities;
using api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Infrastructure.Repositories;

public class PaymentRepository : Repository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context, ITenantContext tenantContext)
        : base(context, tenantContext)
    {
    }

    public async Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId)
    {
        return await _dbSet
            .Where(p => p.RazorpayOrderId == razorpayOrderId)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Payment>> GetByOrderIdAsync(Guid orderId)
    {
        return await _dbSet
            .Where(p => p.OrderId == orderId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Payment?> GetLatestByOrderIdAsync(Guid orderId)
    {
        return await _dbSet
            .Where(p => p.OrderId == orderId)
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();
    }
}