using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs;
using NorthwindBackend.Services;
using NorthwindBackend.Profiles;


namespace NorthwindBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SuppliersController : ControllerBase
{
    private readonly ISupplierService _service;

    public SuppliersController(ISupplierService service)
    {
        _service = service;
    }

    //GET: api/suppliers
    [HttpGet]
    public async Task<ActionResult> GetAllSuppliers()
    {
        var suppliers = await _service.GetSuppliers();

        return Ok(ApiResponse<IEnumerable<SupplierDto>>.Ok(suppliers));
    }

    //GET: api/supplier/id
    [HttpGet ("{id}")]
    public async Task<ActionResult> GetSupplierbyId(int id)
    {
        var supplier = await _service.GetSupplierbyId(id);
        if (supplier == null)
            return NotFound(ApiResponse<SupplierDto>.Fail("Supplier not found"));

        return Ok(ApiResponse<SupplierDto>.Ok(supplier));
    }

    //POST: api/supplier
    [HttpPost]
    public async Task<ActionResult<SupplierDto>> CreateSupplier(CreateSupplierDto dto)
    {
        var supplier = await _service.CreateSupplier(dto);
        return CreatedAtAction(nameof(GetSupplierbyId),
            new { id = supplier.SupplierId },
            supplier
        );
    }

    //PUT: api/supplier/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSupplier(int id, CreateSupplierDto dto)
    {
        var supplier = await _service.UpdateSupplier(id, dto);

        if (!supplier)
            return NotFound();

        return NoContent();
    }
    
    //DELETE: api/supplier/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSupplier(int id)
    {
        var supplier = await _service.DeleteSupplier(id);

        if (!supplier)
            return NotFound();

        return NoContent();
    }
    
    // //GET: api/supplier/search
    // [HttpGet("search")]
    // public async Task<ActionResult> SearchSuppliers(
    //     string? search, string? country, string? sortBy, bool ascending = true)
    // {
    //     var suppliers = await _service.GetSupplierFilteredAsync(search, country, sortBy, ascending);
    //     if (!suppliers.Any())
    //         return NotFound(ApiResponse<IEnumerable<CustomerDto>>.Fail("No customers found"));
    //
    //     return Ok(ApiResponse<IEnumerable<CustomerDto>>.Ok(suppliers));
    // }
}