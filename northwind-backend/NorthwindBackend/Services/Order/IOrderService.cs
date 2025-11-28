using NorthwindBackend.DTOs;

namespace NorthwindBackend.Services;
public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetOrders();
    Task<OrderDto?> GetOrderById(int id);
    Task<OrderDto> CreateOrder(CreateOrderDto dto);
    Task<bool> UpdateOrder(int id, CreateOrderDto dto);
    Task<bool> DeleteOrder(int id);
    Task<IEnumerable<OrderDto>> GetOrdersFilteredAsync(
        int? orderId,
        string? customerId,
        string? shipCountry,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        bool ascending = true);
}