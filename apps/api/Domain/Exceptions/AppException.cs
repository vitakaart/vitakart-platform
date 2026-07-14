// File: apps/api/Domain/Exceptions/AppException.cs
// Base exception for all our custom exceptions
// All other custom exceptions inherit from this

namespace api.Domain.Exceptions;

public class AppException : Exception
{
    public int StatusCode { get; }

    public AppException(string message, int statusCode = 400) 
        : base(message)
    {
        StatusCode = statusCode;
    }
}