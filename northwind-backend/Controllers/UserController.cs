using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NorthwindBackend.DTOs.Auth;
using NorthwindBackend.Models.Identity;

namespace NorthwindBackend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    // GET: api/users
    [HttpGet]
    [Authorize(Policy = "SuperAdminOnly")]
    public async Task<IActionResult> GetUsers()
    {
        var users = _userManager.Users.ToList();
        var result = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);

            result.Add(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                Roles = roles.ToList()
            });
        }

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    // DELETE: api/users/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "SuperAdminOnly")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var currentUserId = User.FindFirst("id")?.Value;

        if (id == currentUserId)
        {
            return BadRequest(new { success = false, message = "You cannot delete your own account" });
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        if (user.IsSuperAdmin)
        {
            return BadRequest(new { success = false, message = "Cannot delete SuperAdmin account" });
        }

        var result = await _userManager.DeleteAsync(user);

        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors });

        return Ok(new { success = true, message = "User deleted" });
    }

    // PUT: api/users/{id}/role
    [HttpPut("{id}/role")]
    [Authorize(Policy = "SuperAdminOnly")]
    public async Task<IActionResult> UpdateUserRole(
        string id,
        [FromBody] UpdateUserRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        var currentRoles = await _userManager.GetRolesAsync(user);

        // Xóa toàn bộ role cũ
        if (currentRoles.Any())
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

        // Gán role mới
        var result = await _userManager.AddToRoleAsync(user, dto.Role);

        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors });

        return Ok(new
        {
            success = true,
            message = $"Updated role of {user.UserName} to {dto.Role}"
        });
    }
    
    [HttpGet("{id}")]
    [Authorize(Policy = "SuperAdminOnly")]
    public async Task<IActionResult> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        return Ok(new
        {
            id = user.Id,
            userName = user.UserName,
            email = user.Email,
            fullName = user.FullName,
            phoneNumber = user.PhoneNumber,
            roles = await _userManager.GetRolesAsync(user)
        });
    }
    
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUserProfile()
    {
        var userId = User.FindFirst("id")?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new { success = false, message = "Unauthorized" });

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        return Ok(new
        {
            success = true,
            id = user.Id,
            userName = user.UserName,
            email = user.Email,
            fullName = user.FullName,
            phoneNumber = user.PhoneNumber,
            roles = await _userManager.GetRolesAsync(user),
            isSuperAdmin = user.IsSuperAdmin
        });
    }
    
    // PUT: api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserProfile(string id, [FromBody] UpdateProfileDto dto)
    {
        var currentUserId = User.FindFirst("id")?.Value;
        var currentUser = await _userManager.FindByIdAsync(currentUserId);

        if (currentUser == null)
            return Unauthorized(new { success = false, message = "Unauthorized" });

        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });
        
        if (id != currentUserId && !currentUser.IsSuperAdmin)
            return Forbid("You can only update your own profile");
        
        if (!string.IsNullOrEmpty(dto.FullName))
            user.FullName = dto.FullName;

        if (!string.IsNullOrEmpty(dto.PhoneNumber))
            user.PhoneNumber = dto.PhoneNumber;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(new { success = false, errors = result.Errors });

        return Ok(new
        {
            success = true,
            message = "Profile updated successfully",
            fullName = user.FullName,
            phoneNumber = user.PhoneNumber
        });
    }
}