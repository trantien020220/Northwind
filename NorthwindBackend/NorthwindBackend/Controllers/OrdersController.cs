using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;
using NorthwindBackend.Profiles;

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

    [HttpGet]
    public async Task<ActionResult> GetOrders()
    {
        var orders = await _service.GetOrders();
        return Ok(ApiResponse<IEnumerable<OrderDto>>.Ok(orders));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetOrder(int id)
    {
        var order = await _service.GetOrderById(id);
        if (order == null) return NotFound(ApiResponse<OrderDto>.Fail("Order not found"));
        return Ok(ApiResponse<OrderDto>.Ok(order));
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder(CreateOrderDto dto)
    {
        var created = await _service.CreateOrder(dto);
        return CreatedAtAction(nameof(GetOrder), new { id = created.OrderId }, ApiResponse<OrderDto>.Ok(created, "Order created successfully"));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateOrder(int id, CreateOrderDto dto)
    {
        var updated = await _service.UpdateOrder(id, dto);
        if (!updated) return NotFound(ApiResponse<string>.Fail("Order not found"));
        return Ok(ApiResponse<string>.Ok("Order updated successfully"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteOrder(int id)
    {
        var deleted = await _service.DeleteOrder(id);
        if (!deleted) return NotFound(ApiResponse<string>.Fail("Order not found"));
        return Ok(ApiResponse<string>.Ok("Order deleted successfully"));
    }
}