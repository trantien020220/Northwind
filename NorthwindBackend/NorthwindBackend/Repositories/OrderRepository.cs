using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly NorthwindContext _context;

        public OrderRepository(NorthwindContext context) : base(context)
        {
            _context = context;
        }

        public new IQueryable<Order> GetAllQueryable()
        {
            return _context.Orders.AsQueryable();
        }

        public async Task<IEnumerable<Order>> GetOrdersFilteredAsync(
            int? orderId,
            string? customerId,
            string? shipCountry,
            DateTime? dateFrom,
            DateTime? dateTo,
            string? sortBy,
            bool ascending = true)
        {
            var query = _context.Orders.AsQueryable();
            
            if (orderId.HasValue)
            {
                query = query.Where(o => o.OrderId == orderId.Value);
            }
            
            if (!string.IsNullOrEmpty(customerId))
            {
                query = query.Where(o => o.CustomerId.Contains(customerId));
            }
            
            if (!string.IsNullOrEmpty(shipCountry))
            {
                query = query.Where(o => o.ShipCountry.Contains(shipCountry));
            }
            
            if (dateFrom.HasValue)
            {
                query = query.Where(o => o.OrderDate >= dateFrom.Value);
            }

            if (dateTo.HasValue)
            {
                query = query.Where(o => o.OrderDate <= dateTo.Value);
            }
            
            if (!string.IsNullOrEmpty(sortBy))
            {
                query = sortBy.ToLower() switch
                {
                    "orderid" => ascending ? query.OrderBy(o => o.OrderId) : query.OrderByDescending(o => o.OrderId),
                    "orderdate" => ascending ? query.OrderBy(o => o.OrderDate) : query.OrderByDescending(o => o.OrderDate),
                    _ => query
                };
            }

            return await query.ToListAsync();
        }
    }
}
