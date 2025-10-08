using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

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
    public async Task<ActionResult<Pagination<Ad>>> GetUsersAds([FromQuery] int pageIndex,
    [FromQuery] int pageSize = 6,
    [FromQuery] string search = "",
    [FromQuery] string sort = "",
    [FromQuery] string category = "")
    {
        return await GetAdsWithSpec(pageIndex, pageSize, search, sort, category, true);
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
        return await GetAdsWithSpec(pageIndex, pageSize, search, sort, category, false);
    }

    [HttpDelete("delete_ad")]
    public async Task DeleteAdd([FromQuery] string adId)
    {
        var userId = GetUserId();
        await _adsRepository.DeleteAd(adId, userId);
    }

    private async Task<ActionResult<Pagination<Ad>>> GetAdsWithSpec(
        int pageIndex,
        int pageSize,
        string search,
        string sort,
        string category,
        bool isMine
    )
    {
        string userId = string.Empty;

        if (isMine)
        {
            userId = GetUserId();
        }

        var specParams = new AdsSpecParams
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            Search = search,
            Sort = sort,
            Category = category == "All" ? "" : category,
            UserId = userId
        };

        var adsWithSpec = new AdsWithSpecification(specParams);

        var ads = await _adsRepository.GetAdsWithSpec(adsWithSpec);

        var count = await _adsRepository.GetCount(search, category == "All" ? "" : category, userId);

        return new Pagination<Ad>(pageSize, pageIndex, count, ads);
    }

    private string GetUserId()
    {
        var claims = HttpContext.User;
        return claims.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}