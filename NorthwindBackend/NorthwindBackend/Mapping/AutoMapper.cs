using AutoMapper;

namespace NorthwindBackend.Mapping{

    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<Models.Customer, DTOs.CustomerDto>().ReverseMap();
            CreateMap<Models.Customer, DTOs.CreateCustomerDto>().ReverseMap();
            CreateMap<Models.Customer, DTOs.OrdersDto>().ReverseMap();
            CreateMap<Models.Customer, DTOs.CreateCustomerDto>().ReverseMap();
        }
    }
}
