namespace NorthwindBackend.Repositories.Supplier;

public interface ISupplierRepository : IGenericRepository<Models.Supplier>
{
    new IQueryable<Models.Supplier> GetAllQueryable();
    
    Task<IEnumerable<Models.Supplier>> GetSuppliersFilteredAsync(
        string? search, 
        string? country, 
        string? sortBy, 
        bool ascending = true);

    Task<Models.Supplier?> GetSupplierWithProductsAsync(int id);
}