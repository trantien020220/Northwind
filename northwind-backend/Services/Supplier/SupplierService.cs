using AutoMapper;
using NorthwindBackend.DTOs.Supplier;
using NorthwindBackend.UnitOfWork;

namespace NorthwindBackend.Services.Supplier;


public class SupplierService : ISupplierService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SupplierService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<SupplierDto>> GetSuppliers()
    {
        var suppliers = await _unitOfWork.Suppliers.GetAllAsync();
        return _mapper.Map<IEnumerable<SupplierDto>>(suppliers);
    }

    public async Task<SupplierDetailDto?> GetSupplierbyId(int id)
    {
        var supplier = await _unitOfWork.Suppliers.GetSupplierWithProductsAsync(id);
        return _mapper.Map<SupplierDetailDto>(supplier);
    }

    public async Task<SupplierDto> CreateSupplier(CreateSupplierDto dto)
    {
        var supplier = _mapper.Map<Models.Supplier>(dto);
        await _unitOfWork.Suppliers.AddAsync(supplier);
        await _unitOfWork.SaveAsync();
        return _mapper.Map<SupplierDto>(supplier);
    }

    public async Task<bool> UpdateSupplier(int id, CreateSupplierDto dto)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
        if (supplier == null) return false;

        _mapper.Map(dto, supplier);
        _unitOfWork.Suppliers.Update(supplier);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteSupplier(int id)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(id);
        if (supplier == null) return false;

        _unitOfWork.Suppliers.Delete(supplier);
        await _unitOfWork.SaveAsync();
        return true;
    }
    
    public async Task<IEnumerable<SupplierDto>> GetSuppliersFilteredAsync(
        string? search, string? country, string? sortBy, bool ascending = true)
    {
        var suppliers = await _unitOfWork.Suppliers.GetSuppliersFilteredAsync(search, country, sortBy, ascending);
        return _mapper.Map<IEnumerable<SupplierDto>>(suppliers);
    }
}