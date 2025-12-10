using AutoMapper;
using NorthwindBackend.DTOs;
using NorthwindBackend.Models;
using NorthwindBackend.UnitOfWork;


namespace NorthwindBackend.Services;


public class OrderDetailService : IOrderDetailService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderDetailService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OrderDetailDto>> GetOrderDetails(int orderId)
    {
        var details = await _unitOfWork.OrderDetail.GetOrderDetailsByOrderIdAsync(orderId);
        return _mapper.Map<IEnumerable<OrderDetailDto>>(details);
    }
    
    public async Task<OrderDetailDto> GetOrderDetailAndProduct(int orderId, int productId)
    {
        var detail = await _unitOfWork.OrderDetail.GetByIdAsync(orderId, productId);
        return _mapper.Map<OrderDetailDto>(detail);
    }

    public async Task<OrderDetailDto> CreateOrderDetail(CreateOrderDetailDto dto)
    {
        var detail = _mapper.Map<OrderDetail>(dto);
        await _unitOfWork.OrderDetail.AddAsync(detail);
        await _unitOfWork.SaveAsync();
        return _mapper.Map<OrderDetailDto>(detail);
    }

    public async Task<bool> UpdateOrderDetail(int orderId, int productId, UpdateOrderDetailDto dto)
    {
        var detail = await _unitOfWork.OrderDetail.GetByIdAsync(orderId, productId);
        if (detail == null) return false;

        _mapper.Map(dto, detail);
        _unitOfWork.OrderDetail.Update(detail);
        await _unitOfWork.SaveAsync();
        return true;
    }

    public async Task<bool> DeleteOrderDetail(int orderId, int productId)
    {
        var detail = await _unitOfWork.OrderDetail.GetByIdAsync(orderId, productId);
        if (detail == null) return false;

        _unitOfWork.OrderDetail.Delete(detail);
        await _unitOfWork.SaveAsync();
        return true;
    }
}