using FluentValidation;
using NorthwindBackend.Models;

namespace NorthwindBackend.Validators;

public class CategoryValidator : AbstractValidator<Category>
{
    public CategoryValidator()
    {
        RuleFor(category => category.CategoryName)
            .NotEmpty().WithMessage("Category Name is required")
            .MaximumLength(40);

        RuleFor(category => category.Description)
            .MaximumLength(30);
    }
}