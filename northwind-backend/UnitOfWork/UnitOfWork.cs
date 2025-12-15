using NorthwindBackend.Models;
using NorthwindBackend.Repositories;
using NorthwindBackend.Repositories.Category;
using NorthwindBackend.Repositories.Customer;
using NorthwindBackend.Repositories.Order;
using NorthwindBackend.Repositories.Product;
using NorthwindBackend.Repositories.Supplier;

namespace NorthwindBackend.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly NorthwindContext _context;
    public ICustomerRepository Customers { get; private set; }
    public IOrderRepository Orders { get; private set; }
    public IProductRepository Products { get; private set; }
    public ISupplierRepository Suppliers { get; private set; }
    public IOrderDetailRepository OrderDetail { get; private set; }
    public ICategoryRepository Category { get; private set; }
    
    public UnitOfWork(NorthwindContext context, ICustomerRepository customerRepository, 
                    IOrderRepository orderRepository, 
                    IProductRepository productRepository, 
                    ISupplierRepository  supplierRepository,
                    IOrderDetailRepository  orderDetailRepository,
                    ICategoryRepository categoryRepository)
    {
        _context = context;
        Customers = customerRepository;
        Orders = orderRepository;
        Products = productRepository;
        Suppliers = supplierRepository;
        OrderDetail = orderDetailRepository;
        Category = categoryRepository;
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

