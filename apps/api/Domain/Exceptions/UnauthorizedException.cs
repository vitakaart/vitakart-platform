// File: apps/api/Domain/Exceptions/UnauthorizedException.cs
// Throw this for auth failures (wrong password, invalid token)
// Returns 401 Unauthorized

namespace api.Domain.Exceptions;

public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message = "Unauthorized access") 
        : base(message, 401)
    {
    }
}