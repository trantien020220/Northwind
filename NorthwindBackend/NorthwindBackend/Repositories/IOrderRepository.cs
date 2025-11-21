using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    IQueryable<Order> GetAllQueryable();

    Task<IEnumerable<Order>> GetOrdersFilteredAsync(
        int? orderId,
        string? customerId,
        string? shipCountry,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        bool ascending = true);
}