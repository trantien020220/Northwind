namespace NorthwindBackend.DTOs;

public class OrderDto
{
    public int OrderId { get; set; }
    public string CustomerId { get; set; } = null!;
    public int? EmployeeId { get; set; }
    public DateTime? OrderDate { get; set; }
    public string? ShipName { get; set; }
    public string? ShipAddress { get; set; }
    public string? ShipPostalCode { get; set; }
    public string? ShipCountry { get; set; }
}