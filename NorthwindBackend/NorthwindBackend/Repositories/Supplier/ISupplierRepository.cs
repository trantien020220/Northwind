using NorthwindBackend.Models;

namespace NorthwindBackend.Repositories;

public interface ISupplierRepository : IGenericRepository<Supplier>
{
    new IQueryable<Supplier> GetAllQueryable();
    
    Task<IEnumerable<Models.Supplier>> GetSuppliersFilteredAsync(
        string? search, 
        string? country, 
        string? sortBy, 
        bool ascending = true);
}