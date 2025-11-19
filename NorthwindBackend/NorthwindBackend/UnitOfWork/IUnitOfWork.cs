using NorthwindBackend.Models;
using NorthwindBackend.Repositories;

namespace NorthwindBackend.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    ICustomerRepository Customers { get; }
    Task<int> SaveAsync();
}