using System.Linq.Expressions;

public class BaseSpecification<T> : ISpecification<T>
{
    public BaseSpecification()
    {
    }

    public BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>> Include { get; } = new();
    public Expression<Func<T, object>> OrderBy { get; private set; }
    public Expression<Func<T, object>> OrderByDesc { get; private set; }
    public int Take { get; private set; }
    public int Skip { get; private set; }

    protected void AddInclude(Expression<Func<T, object>> includeExpression) => Include.Add(includeExpression);
    protected void AddOrderBy(Expression<Func<T, object>> orderByExpression) => OrderBy = orderByExpression;
    protected void AddOrderByDesc(Expression<Func<T, object>> orderByDescExpression)
        => OrderByDesc = orderByDescExpression;

    protected void ApplyPaging(int take, int skip)
    {
        Take = take;
        Skip = skip;
    }
}