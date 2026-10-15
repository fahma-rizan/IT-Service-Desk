using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ServiceDesk.Api.Authorization;
using ServiceDesk.Api.DTOs;
using ServiceDesk.Api.Models;

namespace ServiceDesk.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponse>> Register(RegisterRequest request)
    {
        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName.Trim()
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            return ValidationProblem(ModelState);
        }

        // Public registration always creates an Employee. Roles are never taken from the request.
        await _userManager.AddToRoleAsync(user, AppRoles.Employee);
        await _signInManager.SignInAsync(user, isPersistent: false);

        return await ToResponse(user);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !user.IsActive)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var result = await _signInManager.PasswordSignInAsync(
            user, request.Password, isPersistent: true, lockoutOnFailure: true);

        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return await ToResponse(user);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserResponse>> Me()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null || !user.IsActive)
        {
            return Unauthorized();
        }

        return await ToResponse(user);
    }

    private async Task<UserResponse> ToResponse(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        return new UserResponse(user.Id, user.FullName, user.Email ?? string.Empty, roles);
    }
}