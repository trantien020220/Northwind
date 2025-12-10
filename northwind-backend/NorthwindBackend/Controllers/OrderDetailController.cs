using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;

namespace NorthwindBackend.Controllers;

[Authorize(Policy = "UserAndAdmin")]
[Route("api/[controller]")]
[ApiController]
public class OrderDetailsController : ControllerBase
{
    private readonly IOrderDetailService _service;

    public OrderDetailsController(IOrderDetailService service)
    {
        _service = service;
    }

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrderDetails(int orderId)
    {
        var details = await _service.GetOrderDetails(orderId);
        return Ok(details);
    }
    
    [HttpGet("{orderId}/{productId}")]
    public async Task<IActionResult> GetOrderDetailAndProduct(int orderId, int productId)
    {
        var detail = await _service.GetOrderDetailAndProduct(orderId, productId);
        return Ok(detail);
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrderDetail(CreateOrderDetailDto dto)
    {
        var detail = await _service.CreateOrderDetail(dto);
        return CreatedAtAction(nameof(GetOrderDetails), new { orderId = detail.OrderId }, detail);
    }

    [HttpPut("{orderId}/{productId}")]
    public async Task<IActionResult> UpdateOrderDetail(int orderId, int productId, UpdateOrderDetailDto dto)
    {
        var updated = await _service.UpdateOrderDetail(orderId, productId, dto);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{orderId}/{productId}")]
    public async Task<IActionResult> DeleteOrderDetail(int orderId, int productId)
    {
        var deleted = await _service.DeleteOrderDetail(orderId, productId);
        if (!deleted) return NotFound();
        return NoContent();
    }
}