using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    new IQueryable<Customer> GetAllQueryable();

    Task<IEnumerable<Customer>> GetCustomersFilteredAsync(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true);

    Task<Customer?> GetCustomerWithOrdersAsync(string id);

}