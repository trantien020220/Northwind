using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
using NorthwindBackend.DTOs;

namespace NorthwindBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly IMapper _mapper;        
        private readonly NorthwindContext _context;

        public CustomersController(NorthwindContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //GET: api/customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<CustomerDto>>(customers));
        }

        //GET: api/customers/id
        [HttpGet ("{id}")]
        public async Task<ActionResult> GetCustomer(string id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            return Ok(_mapper.Map<CustomerDto>(customer));
        }

        //POST: api/customers
        [HttpPost]
        public async Task<ActionResult> PostCustomer(CreateCustomerDto dto)
        {
            var customer = _mapper.Map<Customer>(dto);  
            try
            {
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                var result = _mapper.Map<CustomerDto>(customer);
                return CreatedAtAction(nameof(GetCustomer), new { id = customer.CustomerId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            
        }

        //PUT: api/customers/id
        [HttpPut ("{id}")]
        public async Task<ActionResult> UpdateCustomer(string id, CreateCustomerDto dto)
        {
            try
            {
                var existingCustomer = await _context.Customers.FindAsync(id);
                if (existingCustomer == null) return NotFound();

                _mapper.Map(dto, existingCustomer);

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //DELETE: api/customers/id
        [HttpDelete ("{id}")]
        public async Task<ActionResult> DeleteCustomer(string id)
        {
            try
            {
                var customer = await _context.Customers.FindAsync(id);
                if (customer == null) return NotFound();
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }  
        }
    }
}
