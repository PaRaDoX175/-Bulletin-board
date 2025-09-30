using Core.Entities;

public class Ad : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public double Price { get; set; }
    public string Category { get; set; }
    public string Location { get; set; }
    public string Contact { get; set; }
    public string Image { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string UserId { get; set; }
}