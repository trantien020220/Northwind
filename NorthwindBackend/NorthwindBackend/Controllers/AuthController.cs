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

        var authClaims = new List<Claim>
        {
            new Claim("id", user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!)
        };

        authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = GenerateJwtToken(authClaims);
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
            roles
        });
    }
    
    
    // POST: api/auth/promote
    [HttpPost("promote")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> PromoteToAdmin([FromBody] PromoteRequest request)
    {
        if (string.IsNullOrEmpty(request.UserId) && string.IsNullOrEmpty(request.UserName))
            return BadRequest(new { success = false, message = "Need userId or userName" });

        ApplicationUser? user = null;

        if (!string.IsNullOrEmpty(request.UserId))
            user = await _userManager.FindByIdAsync(request.UserId);
        else if (!string.IsNullOrEmpty(request.UserName))
            user = await _userManager.FindByNameAsync(request.UserName);

        if (user == null)
            return NotFound(new { success = false, message = "Not found" });
        
        if (await _userManager.IsInRoleAsync(user, "Admin"))
            return BadRequest(new { success = false, message = $"{user.UserName} already admin!" });
        
        var result = await _userManager.AddToRoleAsync(user, "Admin");

        if (result.Succeeded)
            return Ok(new 
            { 
                success = true, 
                message = $"promoted {user.UserName} to Admin!" 
            });

        return BadRequest(new { success = false, errors = result.Errors });
    }
    
    public class PromoteRequest
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
    }

    private JwtSecurityToken GenerateJwtToken(List<Claim> authClaims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: authClaims,
            expires: DateTime.UtcNow.AddHours(1),
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
