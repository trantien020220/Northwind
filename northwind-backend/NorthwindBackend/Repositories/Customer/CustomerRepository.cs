using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
{
    private readonly NorthwindContext _context;

    public CustomerRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }

    public new IQueryable<Customer> GetAllQueryable()
    {
        return _context.Customers.AsQueryable();
    }
    
    public async Task<Customer?> GetCustomerWithOrdersAsync(string id)
    {
        return await _context.Customers
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.CustomerId == id);
    }
    
    
    public async Task<IEnumerable<Customer>> GetCustomersFilteredAsync(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true)
    {
        var query = _context.Customers.AsQueryable();

        if (!string.IsNullOrEmpty(customerId))
        {
            query = query.Where(c =>
                c.CustomerId.Contains(customerId) || c.CustomerId.Contains(customerId));
        }
        
        if (!string.IsNullOrEmpty(companyName))
        {
            query = query.Where(c =>
                c.CustomerId.Contains(companyName) || c.CompanyName.Contains(companyName));
        }

        if (!string.IsNullOrEmpty(country))
            query = query.Where(c => c.Country == country);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "customerid" => ascending ? query.OrderBy(c => c.CustomerId) : query.OrderByDescending(c => c.CustomerId),
                "companyname" => ascending ? query.OrderBy(c => c.CompanyName) : query.OrderByDescending(c => c.CompanyName),
                "city" => ascending ? query.OrderBy(c => c.City) : query.OrderByDescending(c => c.City),
                _ => query
            };
        }

        return await query.ToListAsync();
    }
}