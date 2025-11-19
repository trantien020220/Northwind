using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly NorthwindContext _context;
    public ICustomerRepository Customers { get; private set; }
    
    public UnitOfWork(NorthwindContext context, ICustomerRepository customerRepository)
    {
        _context = context;
        Customers = customerRepository;
    }
    
    public async Task<int> SaveAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}

