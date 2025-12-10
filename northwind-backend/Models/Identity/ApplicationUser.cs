using Microsoft.AspNetCore.Identity;

namespace NorthwindBackend.Models.Identity;

public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }
}