public class AdsWithSpecification : BaseSpecification<Ad>
{
    public AdsWithSpecification(AdsSpecParams specParams)
        : base(x =>
        (string.IsNullOrEmpty(specParams.Search) || x.Title.ToLower().Contains(specParams.Search) || x.Description.ToLower().Contains(specParams.Search))
        && (string.IsNullOrEmpty(specParams.Category) || x.Category == specParams.Category)
        && (string.IsNullOrEmpty(specParams.UserId) || x.UserId == specParams.UserId)
        && (specParams.MinPrice == null || x.Price >= specParams.MinPrice)
        && (specParams.MaxPrice == null || x.Price <= specParams.MaxPrice))
    {
        ApplyPaging(specParams.PageSize, specParams.PageSize * (specParams.PageIndex - 1));

        switch (specParams.Sort)
        {
            case "asc":
                AddOrderBy(x => x.Price);
                break;
            case "desc":
                AddOrderByDesc(x => x.Price);
                break;
            default:
                AddOrderByDesc(x => x.Date);
                break;
        }
    }
}