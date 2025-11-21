using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface IOrderRepository : IGenericRepository<Order>
{
    Task<IEnumerable<Order>> GetOrdersByCustomerIdAsync(string customerId);
    // Task<IEnumerable<Order>> GetOrdersByEmployeeIdAsync(int employeeId);
}