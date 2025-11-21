using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;
using NorthwindBackend.Profiles;
using NorthwindBackend.Repositories;


namespace NorthwindBackend.Controllers;
    
[Route("api/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;
    private readonly ICustomerRepository _customerRepository;

    public CustomersController(ICustomerService service, ICustomerRepository customerRepository)
    {
        _service = service;
        _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));
    }

    //GET: api/customers
    [HttpGet]
    public async Task<ActionResult> FindCustomers()
    {
        var customers = await _service.GetCustomers();

        return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(customers));
    }

    //GET: api/customers/id
    [HttpGet ("{id}")]
    public async Task<ActionResult> FindCustomerbyId(string id)
    {
        var customer = await _service.GetCustomerbyId(id);
        if (customer == null)
            return NotFound(ApiResponse<CustomerDto>.Fail("Customer not found"));

        return Ok(ApiResponse<CustomerDto>.Ok(customer));
    }

    //POST: api/customers
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto dto)
    {
        var customer = await _service.CreateCustomer(dto);
        return CreatedAtAction(nameof(FindCustomerbyId),
            new { id = customer.CustomerId },
            customer
        );
    }

    //PUT: api/customers/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _service.UpdateCustomer(id, dto);

        if (!customer)
            return NotFound();

        return NoContent();
    }
    
    //DELETE: api/customers/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(string id)
    {
        var customer = await _service.DeleteCustomer(id);

        if (!customer)
            return NotFound();

        return NoContent();
    }
    
    //GET: api/customers/search
    [HttpGet("search")]
    public async Task<ActionResult> SearchCustomers(
        string? search, string? country, string? sortBy, bool ascending = true)
    {
        var customers = await _customerRepository.GetCustomersFilteredAsync(search, country, sortBy, ascending);

        if (!customers.Any())
            return NotFound(ApiResponse<IEnumerable<Customer>>.Fail("No customers found"));

        return Ok(ApiResponse<IEnumerable<Customer>>.Ok(customers));
    }
}
