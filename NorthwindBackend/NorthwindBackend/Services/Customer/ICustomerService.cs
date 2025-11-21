using NorthwindBackend.DTOs;

namespace NorthwindBackend.Services;
public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetCustomers();
    Task<CustomerDto?> GetCustomerbyId(string id);
    Task<CustomerDto> CreateCustomer(CreateCustomerDto dto);
    Task<bool> UpdateCustomer(string id, CreateCustomerDto dto);
    Task<bool> DeleteCustomer(string id);
    Task<IEnumerable<CustomerDto>> GetCustomersFilteredAsync(
        string? search, string? country, string? sortBy, bool ascending = true);
}