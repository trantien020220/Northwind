using NorthwindBackend.DTOs.Customer;

namespace NorthwindBackend.Services.Customer;

public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetCustomers();
    Task<CustomerDetailDto> GetCustomerbyId(string id);
    Task<CustomerDto> CreateCustomer(CreateCustomerDto dto);
    Task<bool> UpdateCustomer(string id, CreateCustomerDto dto);
    Task<bool> DeleteCustomer(string id);
    Task<IEnumerable<CustomerDto>> GetCustomersFilteredAsync(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true);
}