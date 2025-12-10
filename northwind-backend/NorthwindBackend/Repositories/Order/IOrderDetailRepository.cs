using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface IOrderDetailRepository : IGenericRepository<OrderDetail>
{
    Task<OrderDetail?> GetByIdAsync(int orderId, int productId);
    Task<IEnumerable<OrderDetail>> GetOrderDetailsByOrderIdAsync(int orderId);
    
}