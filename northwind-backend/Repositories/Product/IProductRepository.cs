using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true);

    new Task<Product?> GetByIdAsync(object id);
    new IQueryable<Product> GetAllQueryable();
}