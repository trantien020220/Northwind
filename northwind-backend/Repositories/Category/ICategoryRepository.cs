namespace NorthwindBackend.Repositories.Category;

public interface ICategoryRepository : IGenericRepository<Models.Category>
{
    new IQueryable<Models.Category> GetAllQueryable();

    Task<IEnumerable<Models.Category>> GetCategoryFilteredAsync(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true);
    
    Task<Models.Category?> GetCategoryWithProductsAsync(int id);
}