using NorthwindBackend.DTOs;

namespace NorthwindBackend.Services;

public interface IOrderDetailService
{
    Task<IEnumerable<OrderDetailDto>> GetOrderDetails(int orderId);
    Task<OrderDetailDto> GetOrderDetailAndProduct(int orderId, int productId);
    Task<OrderDetailDto> CreateOrderDetail(CreateOrderDetailDto dto);
    Task<bool> UpdateOrderDetail(int orderId, int productId, UpdateOrderDetailDto dto);
    Task<bool> DeleteOrderDetail(int orderId, int productId);
}