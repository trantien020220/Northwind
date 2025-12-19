using NorthwindBackend.DTOs.Category;

namespace NorthwindBackend.Services.Category;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategory();
    Task<CategoryDetailDto?> GetCategoryById(int id);
    Task<CategoryDto> CreateCategory(CreateCategoryDto dto);
    Task<bool> UpdateCategory(int id, CreateCategoryDto dto);
    Task<bool> DeleteCategory(int id);
    Task<IEnumerable<CategoryDto>> GetCategoryFilteredAsync(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true);
}