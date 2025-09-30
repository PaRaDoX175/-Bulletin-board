using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class AdsController : ControllerBase
{
    private readonly IAdsRepository _adsRepository;
    public AdsController(IAdsRepository adsRepository)
    {
        _adsRepository = adsRepository;
    }

    [HttpPost("add")]
    public async Task<ActionResult<Ad>> AddAd([FromBody] Ad ad)
    {
        var userId = GetUserId();

        ad.UserId = userId;

        await _adsRepository.Add(ad);

        return ad;
    }

    [HttpGet("get_user_ads")]
    public async Task<List<Ad>> GetUsersAds()
    {
        var userId = GetUserId();

        return await _adsRepository.FindUsersAds(userId);
    }

    [AllowAnonymous]
    [HttpGet("get_all")]
    public async Task<ActionResult<Pagination<Ad>>> GetAllAds(
    [FromQuery] int pageIndex,
    [FromQuery] int pageSize = 6,
    [FromQuery] string search = "",
    [FromQuery] string sort = "",
    [FromQuery] string category = "")
    {
        var specParams = new AdsSpecParams
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            Sort = sort,
            Category = category == "All" ? "" : category
        };

        var adsWithSpec = new AdsWithSpecification(specParams);

        var ads = await _adsRepository.GetAdsWithSpec(adsWithSpec);

        var count = await _adsRepository.GetCount(search, category == "All" ? "" : category);

        return new Pagination<Ad>(pageSize, pageIndex, count, ads);
    }

    private string GetUserId()
    {
        var claims = HttpContext.User;
        return claims.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}