using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs.Order;
using NorthwindBackend.Models.Responses;
using NorthwindBackend.Services.Order;

namespace NorthwindBackend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }
    
    //GET : api/orders/
    [HttpGet]
    public async Task<ActionResult> GetAllOrders()
    {
        var orders = await _service.GetOrders();
        return Ok(ApiResponse<IEnumerable<OrderDto>>.Ok(orders));
    }
    
    //GET : api/order/id
    [HttpGet("{id}")]
    public async Task<ActionResult> GetOrderById(int id)
    {
        var order = await _service.GetOrderById(id);
        if (order == null) return NotFound(ApiResponse<OrderDto>.Fail("Order not found"));
        return Ok(ApiResponse<OrderDto>.Ok(order));
    }
    
    //POST : api/order/post
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult> CreateOrder(CreateOrderDto dto)
    {
        var order = await _service.CreateOrder(dto);
        return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
    }
    
    //PUT : api/order/put
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateOrderDto dto)
    {
        var order = await _service.UpdateOrder(id, dto);
        if (!order) return 
            NotFound();
        return NoContent();
    }
    
    //DELETE : api/order/delete
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult> DeleteOrder(int id)
    {
        var order = await _service.DeleteOrder(id);
        if (!order) 
            return NotFound();
        return NoContent();
    }
    
    // GET: api/order/search
    [HttpGet("search")]
    public async Task<IActionResult> SearchOrders(
        int? orderId,
        string? customerId,
        string? shipCountry,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        bool ascending = true)
    {
        var orders = await _service.GetOrdersFilteredAsync(
            orderId, customerId, shipCountry, dateFrom, dateTo, sortBy, ascending);

        return Ok(new
        {
            success = true,
            data = orders
        });
    }
}