using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs.Customer;
using NorthwindBackend.Models.Responses;
using NorthwindBackend.Services.Customer;


namespace NorthwindBackend.Controllers;


[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
[ApiController]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service)
    {
        _service = service;
    }

    //GET: api/customers
    [HttpGet]
    public async Task<ActionResult> GetAllCustomers()
    {
        var customers = await _service.GetCustomers();

        return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(customers));
    }

    //GET: api/customer/id
    [HttpGet("{id}")]
    public async Task<ActionResult> GetCustomerbyId(string id)
    {
        var customer = await _service.GetCustomerbyId(id);

        return Ok(ApiResponse<CustomerDetailDto>.Ok(customer));
    }
    
    //POST: api/customer
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto dto)
    {
        var customer = await _service.CreateCustomer(dto);
        return CreatedAtAction(nameof(GetCustomerbyId),
            new { id = customer.CustomerId },
            customer
        );
    }

    //PUT: api/customer/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var customer = await _service.UpdateCustomer(id, dto);

        if (!customer)
            return NotFound();

        return NoContent();
    }
    
    //DELETE: api/customer/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(string id)
    {
        var customer = await _service.DeleteCustomer(id);

        if (!customer)
            return NotFound();

        return NoContent();
    }
    
    //GET: api/customer/search
    [HttpGet("search")]
    public async Task<ActionResult> SearchCustomers(
        string? customerId,
        string? companyName,
        string? country,
        string? sortBy,
        bool ascending = true)
    {
        var customers = await _service.GetCustomersFilteredAsync(customerId, companyName, country, sortBy, ascending);
        if (!customers.Any())
            return NotFound(ApiResponse<IEnumerable<CustomerDto>>.Fail("No customers found"));

        return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(customers));
    }
}