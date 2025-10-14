using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IUserRepository _userRepository;

    public UserController(UserManager<AppUser> userManager, IUserRepository userRepository)
    {
        _userManager = userManager;
        _userRepository = userRepository;
    }

    [HttpPut("update_user")]
    public async Task<ActionResult<UpdateUser>> ChangeImage([FromBody] UpdateUser updateUser)
    {
        var claims = HttpContext.User;
        var user = await _userManager.FindByEmailAsync(claims.FindFirstValue(ClaimTypes.Email));

        user.Email = updateUser.Email;
        user.DisplayName = updateUser.DisplayName;
        user.PictureUrl = updateUser.PictureUrl;
        user.UserName = updateUser.DisplayName;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest("Smth went wrong!");

        return updateUser;
    }
}