using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    ICustomerRepository Customers { get; }
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }
    ISupplierRepository Suppliers { get; }
    IOrderDetailRepository OrderDetail { get; }
    ICategoryRepository Category { get; }
    Task<int> SaveAsync();
}