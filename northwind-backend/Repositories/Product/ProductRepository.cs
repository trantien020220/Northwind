using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories.Product;

public class ProductRepository : GenericRepository<Models.Product>, IProductRepository
{
    private readonly NorthwindContext _context;

    public ProductRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }
    
    public override IQueryable<Models.Product> GetAllQueryable()
    {
        return _context.Products
            .Include(p => p.Supplier)
            .Include(p => p.Category);
    }
    
    public override async Task<Models.Product?> GetByIdAsync(object id)
    {
        return await _context.Products
            .Include(p => p.Supplier)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.ProductId == (int)id);
    }
    
    public async Task<IEnumerable<Models.Product>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true)
    {
        var query = _context.Products
            .Include(p => p.Supplier)
            .Include(p => p.Category)
            .AsQueryable();

        if (productId.HasValue)
            query = query.Where(p => p.ProductId == productId.Value);

        if (!string.IsNullOrEmpty(productName))
            query = query.Where(p => p.ProductName.Contains(productName));

        if (supplierId.HasValue)
            query = query.Where(p => p.SupplierId == supplierId.Value);

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (priceFrom.HasValue)
            query = query.Where(p => p.UnitPrice >= priceFrom.Value);

        if (priceTo.HasValue)
            query = query.Where(p => p.UnitPrice <= priceTo.Value);

        if (!string.IsNullOrEmpty(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "productname" => ascending ? query.OrderBy(p => p.ProductName) : query.OrderByDescending(p => p.ProductName),
                "unitprice"   => ascending ? query.OrderBy(p => p.UnitPrice)   : query.OrderByDescending(p => p.UnitPrice),
                _ => query
            };
        }

        return await query.ToListAsync();
    }

}
