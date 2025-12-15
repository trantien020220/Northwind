namespace NorthwindBackend.Repositories.Order;

public interface IOrderRepository : IGenericRepository<Models.Order>
{
    new IQueryable<Models.Order> GetAllQueryable();

    Task<IEnumerable<Models.Order?>> GetOrdersFilteredAsync(
        int? orderId,
        string? customerId,
        string? shipCountry,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        bool ascending = true);

    Task<Models.Order?> GetByIdWithDetailsAsync(int id);
    
}