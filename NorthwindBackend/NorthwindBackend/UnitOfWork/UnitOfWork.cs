using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly NorthwindContext _context;
    public ICustomerRepository Customers { get; private set; }
    public IOrderRepository Orders { get; private set; }
    public IProductRepository Products { get; private set; }
    public ISupplierRepository Suppliers { get; private set; }
    
    public UnitOfWork(NorthwindContext context, ICustomerRepository customerRepository, IOrderRepository orderRepository, IProductRepository productRepository, ISupplierRepository  supplierRepository)
    {
        _context = context;
        Customers = customerRepository;
        Orders = orderRepository;
        Products = productRepository;
        Suppliers = supplierRepository;
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

