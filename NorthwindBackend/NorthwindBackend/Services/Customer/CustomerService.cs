using Microsoft.EntityFrameworkCore;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using AutoMapper;
using NorthwindBackend.UnitOfWork;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.Services;

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

    public async Task<CustomerDto?> GetCustomerbyId(string id)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> CreateCustomer(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Customer>(dto);  
        await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.Customers.SaveAsync();
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null) return false;

        _mapper.Map(dto, customer);
        
        _unitOfWork.Customers.Update(customer);
        await _unitOfWork.Customers.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteCustomer(string id)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(id);
        if (customer == null) return false;

        _unitOfWork.Customers.Delete(customer);
        await _unitOfWork.Customers.SaveAsync();
        return true;
    }
    public async Task<IEnumerable<CustomerDto>> GetCustomersFilteredAsync(
        string? search, string? country, string? sortBy, bool ascending = true)
    {
        var customers = await _unitOfWork.Customers.GetCustomersFilteredAsync(search, country, sortBy, ascending);
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
}
