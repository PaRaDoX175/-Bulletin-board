using System.Security.Claims;
using API.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IJWTService _jwtService;
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly IUserRepository _userRepository;

    public AccountController(IJWTService jwtService, IUserRepository userRepository, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] Register reg)
    {
        if (await _userManager.FindByEmailAsync(reg.Email) != null)
        {
            return BadRequest("Email already exists");
        }

        var appUser = new AppUser
        {
            DisplayName = reg.DisplayName,
            Email = reg.Email,
            UserName = reg.DisplayName
        };

        var result = await _userManager.CreateAsync(appUser, reg.Password);

        if (!result.Succeeded) return BadRequest("Something went wrong");

        return new UserDto
        {
            Email = reg.Email,
            DisplayName = reg.DisplayName,
            AccessToken = _jwtService.GenerateToken(appUser)
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] Login login)
    {
        var user = await _userManager.FindByEmailAsync(login.Email);

        if (user == null)
        {
            return BadRequest("This login doesnt exist");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, login.Password, false);

        if (!result.Succeeded) return BadRequest("Something went wrong");

        return new UserDto
        {
            Email = login.Email,
            DisplayName = user.DisplayName,
            AccessToken = _jwtService.GenerateToken(user)
        };
    }


    [Authorize]
    [HttpGet("user_info")]
    public async Task<ActionResult<AppUser>> GetUserInfo()
    {
        var claims = HttpContext.User;

        return await _userRepository.GetUserWithAds(claims.FindFirstValue(ClaimTypes.NameIdentifier));
    }

    [HttpGet("all_users")]
    public ActionResult<List<AppUser>> GetAllUsers()
    {
        return _userManager.Users.ToList();
    }
}