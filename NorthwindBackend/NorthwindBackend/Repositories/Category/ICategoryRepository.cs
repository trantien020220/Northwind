using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface ICategoryRepository : IGenericRepository<Category>
{
    new IQueryable<Category> GetAllQueryable();

    Task<IEnumerable<Category>> GetCategoryFilteredAsync(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true);
}