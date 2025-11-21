using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;
using NorthwindBackend.Profiles;

namespace NorthwindBackend.Controllers;
    
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
        var created = await _service.PostCustomer(dto);
        return CreatedAtAction(nameof(FindCustomerbyId),
            new { id = created.CustomerId },
            created
        );
    }

    //PUT: api/customers/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCustomer(string id, CreateCustomerDto dto)
    {
        var updated = await _service.PutCustomer(id, dto);

        if (!updated)
            return NotFound();

        return NoContent();
    }
    
    //DELETE: api/customers/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCustomer(string id)
    {
        var deleted = await _service.DeleteCustomer(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }

}
