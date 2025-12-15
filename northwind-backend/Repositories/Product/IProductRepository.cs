namespace NorthwindBackend.Repositories.Product;

public interface IProductRepository : IGenericRepository<Models.Product>
{
    Task<IEnumerable<Models.Product>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true);

    new Task<Models.Product?> GetByIdAsync(object id);
    new IQueryable<Models.Product> GetAllQueryable();
}