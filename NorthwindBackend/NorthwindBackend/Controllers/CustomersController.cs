using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly NorthwindContext _context;

        public CustomersController(NorthwindContext context)
        {
            _context = context;
        }

        //GET: api/customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _context.Customers.ToListAsync();
        }

        //GET: api/customers/id
        [HttpGet ("{id}")]
        public async Task<ActionResult> GetCustomer(string id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        //POST: api/customers
        [HttpPost]
        public async Task<ActionResult> PostCustomer(Customer customer)
        {
            try
            {
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetCustomer", new { id = customer.CustomerId }, customer);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            
        }

        //PUT: api/customers/id
        [HttpPut ("{id}")]
        public async Task<ActionResult> UpdateCustomer(string id, [FromBody]Customer customer)
        {
            try
            {
                if (id != customer.CustomerId)
                {
                    return BadRequest("Customer ID mismatch");
                }
                if (!await _context.Customers.AnyAsync(c => c.CustomerId == id))
                {
                    return NotFound();
                }
                _context.Customers.Update(customer);
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
