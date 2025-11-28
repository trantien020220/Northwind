using AutoMapper;

namespace NorthwindBackend.Profiles;

public class AutoMapper : Profile
{
    public AutoMapper()
    {
        CreateMap<Models.Customer, DTOs.CustomerDto>().ReverseMap();
        CreateMap<Models.Customer, DTOs.CreateCustomerDto>().ReverseMap();
        CreateMap<Models.Order, DTOs.OrderDto>().ReverseMap();
        CreateMap<Models.Order, DTOs.CreateOrderDto>().ReverseMap();
        CreateMap<Models.Product, DTOs.ProductDto>().ReverseMap();
        CreateMap<Models.Product, DTOs.CreateProductDto>().ReverseMap();
        CreateMap<Models.Supplier, DTOs.SupplierDto>().ReverseMap();
        CreateMap<Models.Supplier, DTOs.CreateSupplierDto>().ReverseMap();
        CreateMap<Models.OrderDetail, DTOs.OrderDetailDto>().ReverseMap();
        CreateMap<Models.OrderDetail, DTOs.CreateOrderDetailDto>().ReverseMap();
        CreateMap<Models.Category, DTOs.CategoryDto>().ReverseMap();
        CreateMap<Models.Category, DTOs.CreateCategoryDto>().ReverseMap();
    }
}
