using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

public class SupplierRepository : GenericRepository<Supplier>, ISupplierRepository
{
    private readonly NorthwindContext _context;

    public SupplierRepository(NorthwindContext context) : base(context)
    {
        _context = context;
    }

    public new IQueryable<Supplier> GetAllQueryable()
    {
        return _context.Suppliers.AsQueryable();
    }

    public async Task<IEnumerable<Supplier>> GetSuppliersFilteredAsync(
        string? search, string? country, string? sortBy, bool ascending = true)
    {
        var query = _context.Suppliers.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.ToLower();

            query = query.Where(s =>
                s.CompanyName.ToLower().Contains(search) ||
                s.ContactName!.ToLower().Contains(search) ||
                s.City!.ToLower().Contains(search) ||
                s.Country!.ToLower().Contains(search) ||
                s.Phone!.ToLower().Contains(search)
            );
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            query = query.Where(s => s.Country == country);
        }

        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            query = sortBy.ToLower() switch
            {
                "companyname" => ascending ? query.OrderBy(s => s.CompanyName) : query.OrderByDescending(s => s.CompanyName),

                "contactname" => ascending ? query.OrderBy(s => s.ContactName) : query.OrderByDescending(s => s.ContactName),

                "city" => ascending ? query.OrderBy(s => s.City) : query.OrderByDescending(s => s.City),

                "country" => ascending ? query.OrderBy(s => s.Country) : query.OrderByDescending(s => s.Country),

                "phone" => ascending ? query.OrderBy(s => s.Phone) : query.OrderByDescending(s => s.Phone),

                _ => query
            };
        }

        return await query.ToListAsync();
    }

}