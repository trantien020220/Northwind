using AutoMapper;
using NorthwindBackend.DTOs;
using NorthwindBackend.DTOs.Customer;
using NorthwindBackend.UnitOfWork;

namespace NorthwindBackend.Services.Customer;

public class CustomerService : ICustomerService
{
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public CustomerService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<CustomerDto>> GetCustomers()
    {
        var customers = await _unitOfWork.Customers.GetAllAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDetailDto> GetCustomerbyId(string id)
    {
        var customer = await _unitOfWork.Customers.GetCustomerWithOrdersAsync(id);

        return _mapper.Map<CustomerDetailDto>(customer);
    }

    public async Task<CustomerDto> CreateCustomer(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Models.Customer>(dto);  
        await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.SaveAsync();
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null) return false;

        _mapper.Map(dto, customer);
        
        _unitOfWork.Customers.Update(customer);
        await _unitOfWork.SaveAsync();
        return true;
    }
    
    public async Task<bool> DeleteCustomer(string id)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null) return false;

        _unitOfWork.Customers.Delete(customer);
        await _unitOfWork.SaveAsync();
        return true;
    }
    
    public async Task<IEnumerable<CustomerDto>> GetCustomersFilteredAsync(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true)
    {
        var customers = await _unitOfWork.Customers.GetCustomersFilteredAsync(customerId, companyName, country, sortBy, ascending);
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
}
