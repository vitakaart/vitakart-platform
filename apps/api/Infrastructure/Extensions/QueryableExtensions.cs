// File: apps/api/Infrastructure/Extensions/QueryableExtensions.cs
// Helper extensions for IQueryable

using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace api.Infrastructure.Extensions;

public static class QueryableExtensions
{
    // Safe async FirstOrDefault with predicate
    public static Task<T?> FirstOrDefaultAsyncSafe<T>(
        this IQueryable<T> query,
        Expression<Func<T, bool>> predicate)
    {
        return query.FirstOrDefaultAsync(predicate);
    }
}