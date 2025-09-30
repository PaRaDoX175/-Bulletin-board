namespace API.Dtos;

public class UserInfoDto
{
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string PictureUrl { get; set; }
    public List<Ad> Ads { get; set; } = new List<Ad>();
}