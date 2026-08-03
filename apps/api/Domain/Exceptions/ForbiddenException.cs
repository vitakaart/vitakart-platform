// File: apps/api/Domain/Exceptions/ForbiddenException.cs
// Throw this when user doesn't have permission
// Returns 403 status code

namespace api.Domain.Exceptions;

public class ForbiddenException : AppException
{
    public ForbiddenException(string message = "Access denied") 
        : base(message, 403)
    {
    }
}