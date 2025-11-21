using Microsoft.EntityFrameworkCore;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using AutoMapper;
using NorthwindBackend.UnitOfWork;

namespace NorthwindBackend.Services;


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
        var order = await _unitOfWork.Orders.GetByIdAsync(id);
        return _mapper.Map<OrderDto>(order);
    }

    public async Task<OrderDto> CreateOrder(CreateOrderDto dto)
    {
        var order = _mapper.Map<Order>(dto);
        await _unitOfWork.Orders.AddAsync(order);
        await _unitOfWork.Orders.SaveAsync();
        return _mapper.Map<OrderDto>(order);
    }

    public async Task<bool> UpdateOrder(int id, CreateOrderDto dto)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(id);
        if (order == null) return false;

        _mapper.Map(dto, order);
        _unitOfWork.Orders.Update(order);
        await _unitOfWork.Orders.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteOrder(int id)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(id);
        if (order == null) return false;

        _unitOfWork.Orders.Delete(order);
        await _unitOfWork.Orders.SaveAsync();
        return true;
    }
}