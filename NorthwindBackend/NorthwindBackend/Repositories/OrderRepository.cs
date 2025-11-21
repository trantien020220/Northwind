using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public class OrderRepository : GenericRepository<Order>, IOrderRepository
{
    private readonly NorthwindContext _context;
    public OrderRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Order>> GetOrdersByCustomerIdAsync(string customerId)
    {
        return await _context.Orders.Where(o => o.CustomerId == customerId).ToListAsync();
    }

    // public async Task<IEnumerable<Order>> GetOrdersByEmployeeIdAsync(int employeeId)
    // {
    //     return await _dbSet.Where(o => o.EmployeeId == employeeId).ToListAsync();
    // }
}