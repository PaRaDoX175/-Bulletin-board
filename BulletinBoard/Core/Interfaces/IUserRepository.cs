using Core.Entities;

public interface IUserRepository
{
    Task<AppUser> GetUserWithAds(string userId);
}