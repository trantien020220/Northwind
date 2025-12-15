namespace NorthwindBackend.Repositories.Customer;

public interface ICustomerRepository : IGenericRepository<Models.Customer>
{
    new IQueryable<Models.Customer> GetAllQueryable();

    Task<IEnumerable<Models.Customer>> GetCustomersFilteredAsync(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true);

    Task<Models.Customer?> GetCustomerWithOrdersAsync(string id);
}