using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;

namespace NorthwindBackend.Controllers
{
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
            return Ok(await _service.GetCustomers());
        }

        //GET: api/customers/id
        [HttpGet ("{id}")]
        public async Task<ActionResult> FindCustomerbyId(string id)
        {
            var customer = await _service.GetCustomerbyId(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        //POST: api/customers
        [HttpPost]
        public async Task<ActionResult> CreateCustomer(CreateCustomerDto dto)
        {
            var customer =  await _service.PostCustomer(dto);
            return CreatedAtAction(nameof(FindCustomerbyId), new { id = customer.CompanyName }, customer);
        }

        //PUT: api/customers/id
        [HttpPut ("{id}")]
        public async Task<ActionResult> UpdateCustomer(string id, CreateCustomerDto dto)
        {
            var customer = await _service.PutCustomer(id, dto);
            if (!customer) return NotFound();
            return NoContent();
        }
        //DELETE: api/customers/id
        [HttpDelete ("{id}")]
        public async Task<ActionResult> DeleteCustomer(string id)
        {
                var customer = await _service.DeleteCustomer(id);
                if (!customer) return NotFound();
                if (!customer) return NotFound();
                return NoContent();
        }
    }
}
