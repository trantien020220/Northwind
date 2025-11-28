using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs;
using NorthwindBackend.Profiles;
using NorthwindBackend.Services;

namespace NorthwindBackend.Controllers;


[Authorize(Policy = "AdminOnly")]
[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoryController(ICategoryService service)
    {
        _service = service;
    }

    //GET: api/category
    [HttpGet]
    public async Task<ActionResult> GetCategories()
    {
        var category = await _service.GetCategory();

        return Ok(ApiResponse<IEnumerable<CategoryDto>>.Ok(category));
    }

    //GET: api/category/id
    [HttpGet ("{id}")]
    public async Task<ActionResult> GetCategoryById(int id)
    {
        var category = await _service.GetCategoryById(id);
        if (category == null)
            return NotFound(ApiResponse<CategoryDto>.Fail("Category not found"));

        return Ok(ApiResponse<CategoryDto>.Ok(category));
    }

    //POST: api/category
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto dto)
    {
        var category = await _service.CreateCategory(dto);
        return CreatedAtAction(nameof(GetCategoryById),
            new { id = category.CategoryId },
            category
        );
    }

    //PUT: api/category/id
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(int id, CreateCategoryDto dto)
    {
        var category = await _service.UpdateCategory(id, dto);
        
        if (!category) 
            return NotFound();
        
        return NoContent();
    }
    
    //DELETE: api/category/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _service.DeleteCategory(id);

        if (!category)
            return NotFound();

        return NoContent();
    }
    
    //GET: api/category/search
    [HttpGet("search")]
    public async Task<ActionResult> SearchCategory(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true)
    {
        var category = await _service.GetCategoryFilteredAsync(categoryId, categoryName, description, sortBy, ascending);
        if (!category.Any())
            return NotFound(ApiResponse<IEnumerable<CategoryDto>>.Fail("No category found"));

        return Ok(ApiResponse<IEnumerable<CategoryDto>>.Ok(category));
    }
}