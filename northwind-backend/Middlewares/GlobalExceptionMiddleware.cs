using System.Net;
using System.Text.Json;

namespace NorthwindBackend.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        HttpStatusCode status;
        string message;

        switch (exception)
        {
            case UnauthorizedAccessException _:
                status = HttpStatusCode.Unauthorized;
                message = "Unauthorized";
                break;
            case KeyNotFoundException _:
            case ArgumentException _:
                status = HttpStatusCode.BadRequest;
                message = exception.Message;
                break;
            default:
                status = HttpStatusCode.InternalServerError;
                message = "Internal Server Error";
                break;
        }

        var response = new
        {
            success = false,
            message,
            error = exception.GetType().Name
        };

        context.Response.StatusCode = (int)status;
        context.Response.ContentType = "application/json";

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}