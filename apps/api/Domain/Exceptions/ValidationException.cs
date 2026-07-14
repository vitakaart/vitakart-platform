// File: apps/api/Domain/Exceptions/ValidationException.cs
// Throw this when data is invalid
// Returns 400 Bad Request

namespace api.Domain.Exceptions;

public class ValidationException : AppException
{
    public ValidationException(string message = "Validation failed") 
        : base(message, 400)
    {
    }
}