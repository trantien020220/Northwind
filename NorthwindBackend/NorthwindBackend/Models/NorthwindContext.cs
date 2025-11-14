using Microsoft.EntityFrameworkCore;

namespace NorthwindBackend.Models;

public class NorthwindContext : DbContext
{
    public NorthwindContext(DbContextOptions<NorthwindContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    // public DbSet<Order> Orders { get; set; } = null!;
    // public DbSet<Product> Products { get; set; } = null!;
    // public DbSet<Category> Categories { get; set; } = null!;
    // public DbSet<Supplier> Suppliers { get; set; } = null!;
    // public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
    // public DbSet<Employee> Employees { get; set; } = null!;
    // public DbSet<Shipper> Shippers { get; set; } = null!;
    // public DbSet<Region> Regions { get; set; } = null!;
    // public DbSet<Territory> Territories { get; set; } = null!;
}
