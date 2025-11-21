using FluentValidation;
using NorthwindBackend.DTOs;

public class OrderValidatior : AbstractValidator<CreateOrderDto>
{
    public  OrderValidatior()
    {
        RuleFor(x => x.OrderId)
                .NotEmpty().WithMessage("ID is required")
                .MaximumLength(5).WithMessage("ID must have 5 characters")
                .MinimumLength(5).WithMessage("ID must have 5 characters");
    }
}