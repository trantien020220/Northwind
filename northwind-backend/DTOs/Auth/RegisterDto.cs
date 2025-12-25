using System.ComponentModel.DataAnnotations;

namespace NorthwindBackend.DTOs.Auth;

public class RegisterDto
{
    [Required(ErrorMessage = "Username is required")]
    public string UserName { get; set; }

    [Required(ErrorMessage = "Full Name is required")]
    public string FullName { get; set; }

    [Required(ErrorMessage = "Phone Number is required")]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email")]
    public string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")]
    public string Password { get; set; }
}