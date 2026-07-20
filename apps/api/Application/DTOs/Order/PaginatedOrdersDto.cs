// File: apps/api/Application/DTOs/Order/PaginatedOrdersDto.cs
// Paginated response for order lists

namespace api.Application.DTOs.Order;

public class PaginatedOrdersDto
{
    public List<OrderListDto> Orders { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}