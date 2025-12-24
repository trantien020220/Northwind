using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NorthwindBackend.DTOs.Auth;
using NorthwindBackend.Models.Identity;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;

namespace NorthwindBackend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _config;

    public AuthController(UserManager<ApplicationUser> userManager,
                          SignInManager<ApplicationUser> signInManager,
                          IConfiguration config)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
    }
    
    //REGISTER
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = new ApplicationUser
        {
            UserName = dto.UserName,
            Email = dto.Email,
            FullName = dto.FullName,
            PhoneNumber = dto.PhoneNumber,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors });
        
        await _userManager.AddToRoleAsync(user, "User");

        return Ok(new { success = true, message = "Success!" });
    }
    
    //LOGIN
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByNameAsync(dto.UserName);
        if (user == null) return Unauthorized(new { success = false, message = "Invalid credentials" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
        if (!result.Succeeded) return Unauthorized(new { success = false, message = "Invalid credentials" });
        
        var roles = await _userManager.GetRolesAsync(user);
        var userClaims = await _userManager.GetClaimsAsync(user);

        var authClaims = new List<Claim>
        {
            new Claim("id", user.Id),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };
        
        authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        authClaims = authClaims
            .GroupBy(c => c.Type)
            .Select(g => g.First())
            .ToList();
        
        authClaims.Add(new Claim("IsSuperAdmin", user.IsSuperAdmin ? "true" : "false"));
        
        foreach (var claim in userClaims)
        {
            if (claim.Type != "IsSuperAdmin")
            {
                authClaims.Add(claim);
            }
        }
        
        var tokenExpiration = roles.Contains("Admin")
                    ? DateTime.UtcNow.AddHours(24)
                    : DateTime.UtcNow.AddHours(1);

        var token = GenerateJwtToken(authClaims, tokenExpiration);

        var refreshToken = GenerateRefreshToken();
        
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);
        
        return Ok(new
        {
            success = true,
            token = new JwtSecurityTokenHandler().WriteToken(token),
            refreshToken,
            expiration = token.ValidTo,
            roles,
            fullName = user.FullName,           
            phoneNumber = user.PhoneNumber,
            email = user.Email,
        });
    }
    
    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = User.FindFirst("id")?.Value;
        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
            return Unauthorized(new { success = false, message = "Unauthorized" });
        
        var passwordCheck = await _userManager.CheckPasswordAsync(user, dto.CurrentPassword);
        if (!passwordCheck)
            return BadRequest(new { success = false, message = "Current password is incorrect" });
        
        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors });

        return Ok(new { success = true, message = "Password changed successfully" });
    }

    private JwtSecurityToken GenerateJwtToken(List<Claim> authClaims, DateTime expires)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: authClaims,
            expires: expires,
            signingCredentials: credentials
        );
    }

    private static string GenerateRefreshToken()
    {
        var random = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(random);
        return Convert.ToBase64String(random);
    }
}