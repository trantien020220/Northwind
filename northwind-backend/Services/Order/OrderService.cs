using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NorthwindBackend.DTOs.Order;
using NorthwindBackend.Models;
using NorthwindBackend.UnitOfWork;

namespace NorthwindBackend.Services.Order;


public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OrderDto>> GetOrders()
    {
        var orders = await _unitOfWork.Orders.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetOrderById(int id)
    {
        var order = await _unitOfWork.Orders.GetByIdWithDetailsAsync(id);
        return _mapper.Map<OrderDto>(order);
    }
    
    
    public async Task<OrderDto> CreateOrder(CreateOrderDto dto)
    {
        var order = _mapper.Map<Models.Order>(dto);
        
        order.OrderDetails = dto.OrderDetails
            .Select(d => new OrderDetail
            {
                ProductId = d.ProductId,
                UnitPrice = d.UnitPrice,
                Quantity = d.Quantity,
                Discount = d.Discount
            })
            .ToList();

        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.SaveAsync();

        var created = await _unitOfWork.Orders
            .GetAllQueryable()
            .Include(o => o.OrderDetails)
            .ThenInclude(d => d.Product)
            .FirstOrDefaultAsync(o => o.OrderId == order.OrderId);

        return _mapper.Map<OrderDto>(created);
    }

    
    public async Task<bool> UpdateOrder(int id, UpdateOrderDto dto)
    {
        var order = await _unitOfWork.Orders.GetByIdWithDetailsAsync(id);
        if (order == null) return false;
        
        _mapper.Map(dto, order);
        
        order.OrderDetails.Clear();
    
        if (dto.OrderDetails != null)
            foreach (var item in dto.OrderDetails)
            {
                order.OrderDetails.Add(new OrderDetail
                {
                    OrderId = id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Discount = item.Discount
                });
            }
    
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteOrder(int id)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(id);
        if (order == null) return false;

        _unitOfWork.Orders.Delete(order);
        await _unitOfWork.SaveAsync();
        return true;
    }
    
    public async Task<IEnumerable<OrderDto>> GetOrdersFilteredAsync(
        int? orderId,
        string? customerId,
        string? shipCountry,
        DateTime? dateFrom,
        DateTime? dateTo,
        string? sortBy,
        bool ascending = true)
    {
        var orders = await _unitOfWork.Orders.GetOrdersFilteredAsync(orderId, customerId, shipCountry, dateFrom, dateTo, sortBy, ascending);
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }
}