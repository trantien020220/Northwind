using NorthwindBackend.DTOs;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetProducts();
    Task<ProductDto?> GetProductById(int id);
    Task<ProductDto> CreateProduct(CreateProductDto dto);
    Task<bool> UpdateProduct(int id, UpdateProductDto dto);
    Task<bool> DeleteProduct(int id);
    Task<IEnumerable<ProductDto>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true);
}