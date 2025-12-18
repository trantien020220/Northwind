using FluentValidation;
using NorthwindBackend.DTOs.Category;
using NorthwindBackend.Models;

namespace NorthwindBackend.Validators;

public class CategoryValidator : AbstractValidator<CreateCategoryDto>
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