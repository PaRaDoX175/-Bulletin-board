
using System.Text.Json;
using StackExchange.Redis;

public class BasketRepository : IBasketRepository
{
    private readonly IDatabase _database;
    public BasketRepository(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task<Basket> GetBasket(string basketId)
    {
        var basket = await _database.StringGetAsync(basketId);
        if (basket.IsNullOrEmpty)
        {
            var newBasket = new Basket { BasketId = basketId };
            await _database.StringSetAsync(newBasket.BasketId, JsonSerializer.Serialize(newBasket));
            return newBasket;
        }
        return JsonSerializer.Deserialize<Basket>(basket);
    }

    public async Task<Basket> UpdateBasket(string basketId, BasketItem basketItem)
    {
        var basket = await GetBasket(basketId);

        basket.Items.Add(basketItem);

        await _database.StringSetAsync(basketId, JsonSerializer.Serialize(basket));
        return await GetBasket(basketId);
    }

    public async Task<Basket?> RemoveBasketItem(string basketId, string basketItemId)
    {
        var basket = await GetBasket(basketId);

        var item = basket.Items.Where(x => x.Id == basketItemId).FirstOrDefault();
        basket.Items.Remove(item);

        await _database.StringSetAsync(basketId, JsonSerializer.Serialize(basket));
        return await GetBasket(basketId) ?? null;
    }
}