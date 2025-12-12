using NorthwindBackend.DTOs;

namespace NorthwindBackend.Services;

public interface ISupplierService
{
    Task<IEnumerable<SupplierDto>> GetSuppliers();
    Task<SupplierDetailDto?> GetSupplierbyId(int id);
    Task<SupplierDto> CreateSupplier(CreateSupplierDto dto);
    Task<bool> UpdateSupplier(int id, CreateSupplierDto dto);
    Task<bool> DeleteSupplier(int id);
    Task<IEnumerable<SupplierDto>> GetSuppliersFilteredAsync(
        string? search, string? country, string? sortBy, bool ascending = true);
}