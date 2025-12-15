using AutoMapper;
using NorthwindBackend.DTOs.Category;
using NorthwindBackend.UnitOfWork;

namespace NorthwindBackend.Services.Category;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategory()
    {
        var categories = await _unitOfWork.Category.GetAllAsync();
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<CategoryDto?> GetCategoryById(int id)
    {
        var category = await _unitOfWork.Category.GetByIdAsync(id);
        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<CategoryDto> CreateCategory(CreateCategoryDto dto)
    {
        var category = _mapper.Map<Models.Category>(dto);
        await _unitOfWork.Category.AddAsync(category);
        await _unitOfWork.SaveAsync();
        return _mapper.Map<CategoryDto>(category);
    }

    public async Task<bool> UpdateCategory(int id, CreateCategoryDto dto)
    {
        var category = await _unitOfWork.Category.GetByIdAsync(id);
        if (category == null) return false;

        _mapper.Map(dto, category);
        _unitOfWork.Category.Update(category);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteCategory(int id)
    {
        var category = await _unitOfWork.Category.GetByIdAsync(id);
        if (category == null) return false;

        _unitOfWork.Category.Delete(category);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoryFilteredAsync(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true)
    {
        var category = await _unitOfWork.Category.GetCategoryFilteredAsync(categoryId, categoryName, description, sortBy, ascending);
        return _mapper.Map<IEnumerable<CategoryDto>>(category);
    }
}