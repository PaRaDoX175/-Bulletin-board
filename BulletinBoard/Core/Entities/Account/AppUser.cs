using Microsoft.AspNetCore.Identity;

namespace Core.Entities;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
    public string PictureUrl { get; set; } = string.Empty;
    public List<Ad> Ads { get; set; } = new List<Ad>();
}