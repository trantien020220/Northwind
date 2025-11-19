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
    
    public async Task<IEnumerable<Customer>> GetCustomerByCompanyNameAsync(string companyName)
        => await _context.Customers.Where(c => c.CompanyName == companyName).ToListAsync();
    
    public async Task<IEnumerable<Customer>> GetCustomerByCountryAsync(string country)
        => await _context.Customers.Where(c => c.Country == country).ToListAsync();
}