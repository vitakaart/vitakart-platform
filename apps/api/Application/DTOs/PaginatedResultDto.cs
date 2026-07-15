// File: apps/api/Application/DTOs/PaginatedResultDto.cs
// Generic pagination wrapper — reusable for all list endpoints

namespace api.Application.DTOs;

public class PaginatedResultDto<T>
{
    public List<T> Items { get; set; } = new();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}