using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs.Product;
using NorthwindBackend.Models.Responses;
using NorthwindBackend.Services.Product;

namespace NorthwindBackend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }
    
    //GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetAllProducts()
    {
        var products = await _service.GetProducts();
        return Ok(ApiResponse<IEnumerable<ProductDto>>.Ok(products));
    }
    
    //GET: api/product/id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(int id)
    {
        var product = await _service.GetProductById(id);
        if (product == null) return NotFound(ApiResponse<string>.Fail("Product not found"));
        return Ok(ApiResponse<ProductDto>.Ok(product));
    }
    
    //POST: api/product
    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var product = await _service.CreateProduct(dto);
        return CreatedAtAction(nameof(GetProductById), new { id = product.ProductId }, product);
    }
    
    //PUT: api/product/id
    [HttpPut("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> UpdateProduct(int id, UpdateProductDto dto)
    {
        var product = await _service.UpdateProduct(id, dto);
        if (!product) 
            return NotFound();
        return NoContent();
    }

    //DELETE: api/product/id
    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _service.DeleteProduct(id);
        if (!product) 
            return NotFound();
        return NoContent();
    }
    
    //GET: api/product/search
    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true)
    {
        var results = await _service.GetProductsFilteredAsync(
            productId, productName, supplierId, categoryId, priceFrom, priceTo, sortBy, ascending);

        return Ok(ApiResponse<IEnumerable<ProductDto>>.Ok(results));
    }
}
