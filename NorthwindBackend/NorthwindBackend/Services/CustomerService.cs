using Microsoft.EntityFrameworkCore;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using AutoMapper;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.Services;

public class CustomerService : ICustomerService
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Customer> _customerRepository;

    public CustomerService(IGenericRepository<Customer> customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CustomerDto>> GetCustomers()
    {
        var customers = await _customerRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetCustomerbyId(string id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> PostCustomer(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Customer>(dto);  
        _customerRepository.AddAsync(customer);
        await _customerRepository.SaveAsync();
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> PutCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return false;

        _mapper.Map(dto, customer);
        
        _customerRepository.Update(customer);
        await _customerRepository.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteCustomer(string id)
    {
        var customer = await _customerRepository.GetByIdAsync(id);
        if (customer == null) return false;

        _customerRepository.Delete(customer);
        await _customerRepository.SaveAsync();
        return true;
    }
}
