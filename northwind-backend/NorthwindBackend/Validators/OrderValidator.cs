using FluentValidation;
using NorthwindBackend.DTOs;

namespace NorthwindBackend.Validators;

public class OrderValidator : AbstractValidator<CreateOrderDto>
{
    public  OrderValidator()
    {
        RuleFor(order => order.CustomerId)
                .NotEmpty().WithMessage("CustomerID is required")
                .MaximumLength(5).WithMessage("ID must have 5 characters")
                .MinimumLength(5).WithMessage("ID must have 5 characters");

        RuleFor(order => order.OrderDate)
            .NotEmpty().WithMessage("Order Date is required");

        RuleFor(order => order.ShipCountry)
            .NotEmpty().WithMessage("ShipCountry is required")
            .MaximumLength(50).WithMessage("Country not above 50 characters");
    }
}