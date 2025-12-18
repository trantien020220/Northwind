using FluentValidation;
using NorthwindBackend.DTOs;
using NorthwindBackend.DTOs.Product;

namespace NorthwindBackend.Validators;

public class ProductValidator : AbstractValidator<CreateProductDto>
{
    public  ProductValidator()
    {
        RuleFor(product => product.ProductName)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(50).WithMessage("Product cant have above 50 characters");

        RuleFor(product => product.UnitPrice)
            .NotEmpty().WithMessage("Price is required");

        RuleFor(product => product.UnitsInStock)
            .NotEmpty().WithMessage("Stock is required");
        
        RuleFor(product => product.CategoryId)
            .NotEmpty().WithMessage("Category is required");
        
        RuleFor(product => product.SupplierId)
            .NotEmpty().WithMessage("Supplier is required");
    }
}