namespace NorthwindBackend.DTOs;

public class UpdateOrderDetailDto
{
    public int ProductId { get; set; }
    public short? Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public float Discount { get; set; }
}
