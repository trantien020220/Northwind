using FluentValidation;
using NorthwindBackend.DTOs;
using NorthwindBackend.DTOs.Supplier;

namespace NorthwindBackend.Validators;

public class SupplierValidator : AbstractValidator<CreateSupplierDto>
{
    public SupplierValidator()
    {
        RuleFor(supplier => supplier.CompanyName)
            .NotEmpty().WithMessage("Company name is required")
            .MaximumLength(50).WithMessage("Company name cant have above 50 characters");

        RuleFor(supplier => supplier.Phone)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\d{9,11}$").WithMessage("Phone must be from 9 to 11 digits");

        RuleFor(supplier => supplier.Country)
            .NotEmpty().WithMessage("Country is required");    }
}

