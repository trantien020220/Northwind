namespace NorthwindBackend.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string CustomerId { get; set; } = null!;
        public DateTime OrderDate { get; set; }
        public DateTime? RequiredDate { get; set; }
        public DateTime? ShippedDate { get; set; }
        public decimal? Freight { get; set; }
        public string? ShipName { get; set; }
        public string? ShipCity { get; set; }
        public string? ShipCountry { get; set; }
    }
}