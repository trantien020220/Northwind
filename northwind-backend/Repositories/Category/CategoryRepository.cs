using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories.Category;

public class CategoryRepository : GenericRepository<Models.Category>, ICategoryRepository
{
    private readonly NorthwindContext _context;

    public CategoryRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }

    public new IQueryable<Models.Category> GetAllQueryable()
    {
        return _context.Categories.AsQueryable();
    }
    
    public async Task<Models.Category?> GetCategoryWithProductsAsync(int id)
    {
        return await _context.Categories
            .Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.CategoryId == id);
    }

    public async Task<IEnumerable<Models.Category>> GetCategoryFilteredAsync(
        int? categoryId,
        string? categoryName,
        string? description,
        string? sortBy,
        bool ascending = true)
    {
        var query = _context.Categories.AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (!string.IsNullOrEmpty(categoryName))
            query = query.Where(p => p.CategoryName.Contains(categoryName));

        if (!string.IsNullOrEmpty(description))
            query = query.Where(p => p.Description != null && p.Description.Contains(description));
        

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "categoryname" => ascending ? query.OrderBy(p => p.CategoryName) : query.OrderByDescending(p => p.CategoryName),
                _ => query
            };
        }

        return await query.ToListAsync();
    }
}