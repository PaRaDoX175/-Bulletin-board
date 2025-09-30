using Core.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class UserRepository : IUserRepository
{
    private readonly UserManager<AppUser> _userManager;
    public UserRepository(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<AppUser> GetUserWithAds(string userId)
    {
        return await _userManager.Users.Include(x => x.Ads).FirstOrDefaultAsync(x => x.Id == userId);
    }
}