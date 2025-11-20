using FluentValidation;
using NorthwindBackend.DTOs;

public class CreateCustomerDtoValidator : AbstractValidator<CreateCustomerDto>
{
    public CreateCustomerDtoValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("ID is required")
            .MaximumLength(5).WithMessage("ID must have 5 characters")
            .MinimumLength(5).WithMessage("ID must have 5 characters");
        
        RuleFor(x => x.CompanyName)
            .NotEmpty().WithMessage("CompanyName is required")
            .MaximumLength(40);

        RuleFor(x => x.ContactName)
            .MaximumLength(30);

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required")
            .MaximumLength(15);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d{9,11}$").WithMessage("Phone must be from 9 to 11 digits");
    }
}