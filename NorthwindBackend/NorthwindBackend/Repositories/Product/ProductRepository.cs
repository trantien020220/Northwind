using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    private readonly NorthwindContext _context;

    public ProductRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }

    public new IQueryable<Product> GetAllQueryable()
    {
        return _context.Products.AsQueryable();
    }

    public async Task<IEnumerable<Product>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true)
    {
        var query = _context.Products.AsQueryable();

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
                "productid" => ascending ? query.OrderBy(p => p.ProductId) : query.OrderByDescending(p => p.ProductId),
                "productname" => ascending ? query.OrderBy(p => p.ProductName) : query.OrderByDescending(p => p.ProductName),
                "unitprice" => ascending ? query.OrderBy(p => p.UnitPrice) : query.OrderByDescending(p => p.UnitPrice),
                _ => query
            };
        }

        return await query.ToListAsync();
    }
}
