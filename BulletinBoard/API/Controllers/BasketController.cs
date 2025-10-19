using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class BasketController : ControllerBase
{
    private readonly IBasketRepository _basket;

    public BasketController(IBasketRepository basket)
    {
        _basket = basket;
    }

    [HttpGet("get_basket")]
    public async Task<Basket> GetBasketAsync()
    {
        var claims = HttpContext.User;
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);

        var basket = await _basket.GetBasket(userId);
        return basket;
    }

    [HttpPost("add_item")]
    public async Task<Basket> AddItemToBasket([FromBody] BasketItem basketItem)
    {
        var claims = HttpContext.User;
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);

        return await _basket.UpdateBasket(userId, basketItem);
    }

    [HttpDelete("remove_item")]
    public async Task<Basket> RemoveBasketItem([FromQuery] string basketItemId)
    {
        var claims = HttpContext.User;
        var userId = claims.FindFirstValue(ClaimTypes.NameIdentifier);

        return await _basket.RemoveBasketItem(userId, basketItemId);
    }
}