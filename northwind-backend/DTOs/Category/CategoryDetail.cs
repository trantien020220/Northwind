using NorthwindBackend.DTOs.Product;

namespace NorthwindBackend.DTOs.Category;

public class CategoryDetailDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string? Description { get; set; }
    
    public List<ProductDto> Products { get; set; } = new();
}