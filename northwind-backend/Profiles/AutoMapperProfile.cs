using AutoMapper;
using NorthwindBackend.Models;
using NorthwindBackend.DTOs;

namespace NorthwindBackendProfiles;

public class AutoMapper : Profile
{
    public AutoMapper()
    {
        CreateMap<Customer, CustomerDto>().ReverseMap();
        CreateMap<Customer, CreateCustomerDto>().ReverseMap();
        CreateMap<Customer, CustomerDetailDto>().ReverseMap();
        // CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<Product, CreateProductDto>();
        CreateMap<Supplier, SupplierDto>().ReverseMap();
        CreateMap<Supplier, CreateSupplierDto>().ReverseMap();

        CreateMap<Order, OrderDto>();
        CreateMap<OrderDetail, OrderDetailDto>();
        
        CreateMap<CreateOrderDto, Order>()
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Customer, opt => opt.Ignore())
            .ForMember(dest => dest.OrderDetails, opt => opt.Ignore());

        CreateMap<CreateOrderDetailDto, OrderDetail>()
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore());
        
        CreateMap<UpdateOrderDto, Order>()
            .ForMember(dest => dest.OrderId, opt => opt.Ignore())
            .ForMember(dest => dest.Customer, opt => opt.Ignore())
            .ForMember(dest => dest.OrderDetails, opt => opt.Ignore());

        CreateMap<UpdateOrderDetailDto, OrderDetail>()
            .ForMember(dest => dest.Order, opt => opt.Ignore())
            .ForMember(dest => dest.Product, opt => opt.Ignore())
            .ForMember(dest => dest.OrderId, opt => opt.Ignore());
        
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.SupplierName, 
                opt => opt.MapFrom(src => src.Supplier != null ? src.Supplier.CompanyName : null))
            .ForMember(dest => dest.CategoryName,
                opt => opt.MapFrom(src => src.Category != null ? src.Category.CategoryName : null));
        
        CreateMap<Category, CategoryDto>().ReverseMap();
        CreateMap<Category, CreateCategoryDto>().ReverseMap();
    }
}
