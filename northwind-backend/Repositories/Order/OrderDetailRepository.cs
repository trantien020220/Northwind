using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories.Order;

public class OrderDetailRepository : GenericRepository<OrderDetail>, IOrderDetailRepository
{
    private readonly NorthwindContext _context;

    public OrderDetailRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }
    
    public async Task<OrderDetail?> GetByIdAsync(int orderId, int productId)
    {
        return await _context.OrderDetail
            .Include(od => od.Product)
            .FirstOrDefaultAsync(od => od.OrderId == orderId && od.ProductId == productId);

    }

    public async Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId)
    {
        return await _context.OrderDetail
            .Include(od => od.Product)
            .Where(od => od.OrderId == orderId)
            .ToListAsync();

    }
}