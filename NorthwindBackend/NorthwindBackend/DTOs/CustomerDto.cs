using System;

namespace NorthwindBackend.DTOs;

public class CustomerDto
{
    public string CustomerId { get; set; } = null!;
    public string CompanyName { get; set; } = null!;
    public string? ContactName { get; set; }
    public string? ContactTitle { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
}
