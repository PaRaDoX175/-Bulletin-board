public class Basket
{
    public string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = new();
}