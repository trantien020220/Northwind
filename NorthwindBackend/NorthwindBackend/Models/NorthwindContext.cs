using Microsoft.EntityFrameworkCore;

namespace NorthwindBackend.Models;

public class NorthwindContext : DbContext
{
    public NorthwindContext(DbContextOptions<NorthwindContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Customer ---
        modelBuilder.Entity<Customer>()
            .HasKey(c => c.CustomerId); // Khóa chính

        modelBuilder.Entity<Customer>()
            .Property(c => c.CustomerId)
            .HasMaxLength(5)
            .IsRequired();

        modelBuilder.Entity<Customer>()
            .HasMany<Order>(c => c.Orders)
            .WithOne(o => o.Customer)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.Cascade);

        // --- Order ---
        modelBuilder.Entity<Order>()
            .HasKey(o => o.OrderId);

        modelBuilder.Entity<Order>()
            .Property(o => o.OrderId)
            .UseIdentityColumn();
        

        // --- Product ---
        modelBuilder.Entity<Product>()
            .HasKey(p => p.ProductId);

        modelBuilder.Entity<Product>()
            .Property(p => p.ProductId)
            .UseIdentityColumn();
    }

}
