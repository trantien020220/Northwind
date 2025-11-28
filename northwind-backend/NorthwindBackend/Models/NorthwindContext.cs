using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.Models.Identity;

namespace NorthwindBackend.Models;

public class NorthwindContext : IdentityDbContext<ApplicationUser>
{
    public NorthwindContext(DbContextOptions<NorthwindContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Supplier> Suppliers { get; set; } = null!;
    public DbSet<OrderDetail> OrderDetail { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Customer>()
        .HasKey(c => c.CustomerId);

    modelBuilder.Entity<Customer>()
        .Property(c => c.CustomerId)
        .HasMaxLength(5)
        .IsRequired();

    modelBuilder.Entity<Customer>()
        .HasMany<Order>(c => c.Orders)
        .WithOne(o => o.Customer)
        .HasForeignKey(o => o.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);
    
    
    //
    modelBuilder.Entity<Supplier>()
        .HasKey(s => s.SupplierId);

    modelBuilder.Entity<Supplier>()
        .Property(s => s.SupplierId)
        .UseIdentityColumn();

    modelBuilder.Entity<Supplier>()
        .HasMany<Product>(s => s.Products)
        .WithOne(p => p.Supplier)
        .HasForeignKey(p => p.SupplierId)
        .OnDelete(DeleteBehavior.Restrict);

    
    //
    modelBuilder.Entity<Product>()
        .HasKey(p => p.ProductId);

    modelBuilder.Entity<Product>()
        .Property(p => p.ProductId)
        .UseIdentityColumn();

    modelBuilder.Entity<Product>()
        .HasOne(p => p.Supplier)
        .WithMany(s => s.Products)
        .HasForeignKey(p => p.SupplierId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Product>()
        .HasOne<Category>(p => p.Category)
        .WithMany(c => c.Products)
        .HasForeignKey(p => p.CategoryId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Product>()
        .HasMany<OrderDetail>(p => p.OrderDetails)
        .WithOne(od => od.Product)
        .HasForeignKey(od => od.ProductId)
        .OnDelete(DeleteBehavior.Cascade);
    
    modelBuilder.Entity<Product>()
        .Property(p => p.UnitPrice)
        .HasPrecision(18, 2);


    //
    modelBuilder.Entity<Order>()
        .HasKey(o => o.OrderId);

    modelBuilder.Entity<Order>()
        .Property(o => o.OrderId)
        .UseIdentityColumn();

    modelBuilder.Entity<Order>()
        .HasOne<Customer>(o => o.Customer)
        .WithMany(c => c.Orders)
        .HasForeignKey(o => o.CustomerId)
        .OnDelete(DeleteBehavior.Cascade);

    modelBuilder.Entity<Order>()
        .HasMany<OrderDetail>(o => o.OrderDetails)
        .WithOne(od => od.Order)
        .HasForeignKey(od => od.OrderId)
        .OnDelete(DeleteBehavior.Cascade);
    
    modelBuilder.Entity<Order>()
        .Property(o => o.Freight)
        .HasPrecision(18, 2);
    
    
    //
    modelBuilder.Entity<OrderDetail>()
        .ToTable("Order Details");

    modelBuilder.Entity<OrderDetail>()
        .HasKey(od => new { od.OrderId, od.ProductId });

    modelBuilder.Entity<OrderDetail>()
        .Property(od => od.UnitPrice)
        .HasColumnType("money");

    modelBuilder.Entity<OrderDetail>()
        .Property(od => od.Discount)
        .HasColumnType("real");


    modelBuilder.Entity<OrderDetail>()
        .HasOne(od => od.Order)
        .WithMany(o => o.OrderDetails)
        .HasForeignKey(od => od.OrderId);

    modelBuilder.Entity<OrderDetail>()
        .HasOne(od => od.Product)
        .WithMany(p => p.OrderDetails)
        .HasForeignKey(od => od.ProductId);
    
    
    //
    modelBuilder.Entity<Category>()
        .ToTable("Categories");

    modelBuilder.Entity<Category>()
        .HasKey(c => c.CategoryId);

    modelBuilder.Entity<Category>()
        .Property(c => c.CategoryId)
        .UseIdentityColumn();

    modelBuilder.Entity<Category>()
        .HasMany(c => c.Products)
        .WithOne(p => p.Category)
        .HasForeignKey(p => p.CategoryId)
        .OnDelete(DeleteBehavior.Restrict);
    }

}
