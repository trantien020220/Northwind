namespace NorthwindBackend.DTOs.Order;

public class UpdateOrderDetailDto
{
    public int ProductId { get; set; }
    public short? Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public float Discount { get; set; }
}
