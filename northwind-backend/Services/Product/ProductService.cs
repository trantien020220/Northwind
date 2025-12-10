using AutoMapper;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using NorthwindBackend.UnitOfWork;


namespace NorthwindBackend.Services;


public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ProductService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductDto>> GetProducts()
    {
        var products = await _unitOfWork.Products.GetAllAsync();
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetProductById(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateProduct(CreateProductDto dto)
    {
        var product = _mapper.Map<Product>(dto);
        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveAsync();
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<bool> UpdateProduct(int id, CreateProductDto dto)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null) return false;

        _mapper.Map(dto, product);
        _unitOfWork.Products.Update(product);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteProduct(int id)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(id);
        if (product == null) return false;

        _unitOfWork.Products.Delete(product);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<IEnumerable<ProductDto>> GetProductsFilteredAsync(
        int? productId,
        string? productName,
        int? supplierId,
        int? categoryId,
        decimal? priceFrom,
        decimal? priceTo,
        string? sortBy,
        bool ascending = true)
    {
        var products = await _unitOfWork.Products.GetProductsFilteredAsync(
            productId, productName, supplierId, categoryId, priceFrom, priceTo, sortBy, ascending);
        return _mapper.Map<IEnumerable<ProductDto>>(products);
    }
}
