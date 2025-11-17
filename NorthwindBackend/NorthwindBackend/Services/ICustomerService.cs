using NorthwindBackend.DTOs;

namespace NorthwindBackend.Services;
public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetCustomers();
    Task<CustomerDto?> GetCustomerbyId(string id);
    Task<CustomerDto> PostCustomer(CreateCustomerDto dto);
    Task<bool> PutCustomer(string id, CreateCustomerDto dto);
    Task<bool> DeleteCustomer(string id);
}