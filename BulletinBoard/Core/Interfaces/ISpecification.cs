using System.Linq.Expressions;

public interface ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>> Include { get; }
    public Expression<Func<T, object>> OrderBy { get; }
    public Expression<Func<T, object>> OrderByDesc { get; }
    public int Take { get; }
    public int Skip { get; }
}