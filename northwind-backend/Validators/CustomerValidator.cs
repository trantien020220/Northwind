using FluentValidation;
using NorthwindBackend.DTOs;
using NorthwindBackend.DTOs.Customer;

namespace NorthwindBackend.Validators;

public class CustomerValidator : AbstractValidator<CreateCustomerDto>
{
    public CustomerValidator()
    {
        RuleFor(customer => customer.CustomerId)
            .NotEmpty().WithMessage("ID is required")
            .MaximumLength(5).WithMessage("ID must have 5 characters")
            .MinimumLength(5).WithMessage("ID must have 5 characters");
        
        RuleFor(customer => customer.CompanyName)
            .NotEmpty().WithMessage("CompanyName is required")
            .MaximumLength(40);

        RuleFor(customer => customer.ContactName)
            .MaximumLength(30);

        RuleFor(customer => customer.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(15);

        RuleFor(customer => customer.Phone)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d{9,11}$").WithMessage("Phone must be from 9 to 11 digits");
    }
}