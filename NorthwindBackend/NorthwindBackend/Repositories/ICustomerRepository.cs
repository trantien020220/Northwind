using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    Task<IEnumerable<Customer>> GetCustomerByCompanyNameAsync(string companyName);
    Task<IEnumerable<Customer>> GetCustomerByCountryAsync(string country);
}