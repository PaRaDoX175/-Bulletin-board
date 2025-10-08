using Microsoft.EntityFrameworkCore;

public class SpecificationEvaluator<T> where T : class
{
    public static IQueryable<T> GetQuery(IQueryable<T> input, ISpecification<T> spec)
    {
        var query = input;



        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria);
        }

        if (spec.OrderBy != null)
        {
            query = query.OrderBy(spec.OrderBy);
        }

        if (spec.OrderByDesc != null)
        {
            query = query.OrderByDescending(spec.OrderByDesc);
        }

        query = spec.Include.Aggregate(query, (current, include) => current.Include(include));

        query = query.Skip(spec.Skip).Take(spec.Take);

        return query;
    }
}