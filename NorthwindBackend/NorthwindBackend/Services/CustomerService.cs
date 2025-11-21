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

    public async Task<CustomerDto> PostCustomer(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Customer>(dto);  
        await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.Customers.SaveAsync();
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> PutCustomer(string id, CreateCustomerDto dto)
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
        var query = _unitOfWork.Customers.GetAllQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            // Tìm theo CustomerId hoặc CompanyName
            query = query.Where(c => c.CustomerId.Contains(search) || c.CompanyName.Contains(search));
        }

        if (!string.IsNullOrEmpty(country))
            query = query.Where(c => c.Country == country);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "customerid" => ascending ? query.OrderBy(c => c.CustomerId) : query.OrderByDescending(c => c.CustomerId),
                "companyname" => ascending ? query.OrderBy(c => c.CompanyName) : query.OrderByDescending(c => c.CompanyName),
                "city" => ascending ? query.OrderBy(c => c.City) : query.OrderByDescending(c => c.City),
                _ => query
            };
        }

        var customers = await query.ToListAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
}
