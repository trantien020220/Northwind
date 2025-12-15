using NorthwindBackend.Models;
using NorthwindBackend.Repositories;
using NorthwindBackend.Repositories.Category;
using NorthwindBackend.Repositories.Customer;
using NorthwindBackend.Repositories.Order;
using NorthwindBackend.Repositories.Product;
using NorthwindBackend.Repositories.Supplier;

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