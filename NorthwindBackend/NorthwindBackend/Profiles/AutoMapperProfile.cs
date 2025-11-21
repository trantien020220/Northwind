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
    }
}
