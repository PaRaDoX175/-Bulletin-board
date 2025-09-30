public class AdsSpecParams
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    private string _search { get; set; }
    public string Sort { get; set; }
    public string Category { get; set; }
    public string Search { get => _search; set => _search = value.ToLower(); }
}