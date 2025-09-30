public class AdsWithSpecification : BaseSpecification<Ad>
{
    public AdsWithSpecification(AdsSpecParams specParams)
        : base(x =>
        (string.IsNullOrEmpty(specParams.Search) || x.Title.ToLower().Contains(specParams.Search) || x.Description.ToLower().Contains(specParams.Search))
        && (string.IsNullOrEmpty(specParams.Category) || x.Category == specParams.Category))
    {
        ApplyPaging(specParams.PageSize, specParams.PageSize * (specParams.PageIndex - 1));


        if (!string.IsNullOrEmpty(specParams.Sort))
        {
            switch (specParams.Sort)
            {
                case "asc":
                    AddOrderBy(x => x.Price);
                    break;
                case "desc":
                    AddOrderByDesc(x => x.Price);
                    break;
            }
        }
    }
}