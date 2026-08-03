// File: apps/api/Domain/Exceptions/BadRequestException.cs
// Throw this when request data is invalid
// Returns 400 status code

namespace api.Domain.Exceptions;

public class BadRequestException : AppException
{
    public BadRequestException(string message = "Invalid request") 
        : base(message, 400)
    {
    }
}