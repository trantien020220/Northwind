using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    new IQueryable<Customer> GetAllQueryable();
    
    Task<IEnumerable<Customer>> GetCustomersFilteredAsync(
        string? search, 
        string? country, 
        string? sortBy, 
        bool ascending = true);

}