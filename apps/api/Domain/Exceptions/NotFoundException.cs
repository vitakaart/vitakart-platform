// File: apps/api/Domain/Exceptions/NotFoundException.cs
// Throw this when something is not found in DB
// Returns 404 status code

namespace api.Domain.Exceptions;

public class NotFoundException : AppException
{
    public NotFoundException(string message = "Resource not found") 
        : base(message, 404)
    {
    }
}