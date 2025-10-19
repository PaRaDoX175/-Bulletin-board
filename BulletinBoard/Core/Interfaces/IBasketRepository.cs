public interface IBasketRepository
{
    Task<Basket> GetBasket(string basketId);
    Task<Basket> UpdateBasket(string basketId, BasketItem basketItem);
    Task<Basket> RemoveBasketItem(string basketId, string basketItemId);
}