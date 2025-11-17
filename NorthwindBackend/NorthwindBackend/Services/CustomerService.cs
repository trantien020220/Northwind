using Microsoft.EntityFrameworkCore;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using AutoMapper;

namespace NorthwindBackend.Services;

public class CustomerService : InterfaceCustomerService
{
    private readonly IMapper _mapper;        
    private readonly NorthwindContext _context;

    public CustomerService(NorthwindContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CustomerDto>> GetCustomers()
    {
        var customers = await _context.Customers.ToListAsync();
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }

    public async Task<CustomerDto?> GetCustomerbyId(string id)
    {
        var customer = await _context.Customers.FindAsync(id);
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<CustomerDto> PostCustomer(CreateCustomerDto dto)
    {
        var customer = _mapper.Map<Customer>(dto);  
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return _mapper.Map<CustomerDto>(customer);
    }

    public async Task<bool> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return false;

        _mapper.Map(dto, customer);

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCustomer(string id)
    {
        var customer = await _context.Customers.FindAsync(id);
        if (customer == null) return false;

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();
        return true;
    }

    public Task<CustomerDto?> GetCustomers(string id)
    {
        throw new NotImplementedException();
    }

    public Task FindAsync(string id)
    {
        throw new NotImplementedException();
    }

    public Task<bool> PutCustomer(string id, CreateCustomerDto dto)
    {
        throw new NotImplementedException();
    }
}
