using System.Linq.Expressions;

public interface ISpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; }
    public List<Expression<Func<T, object>>> Include { get; }
    public Expression<Func<T, object>> OrderBy { get; }
    public Expression<Func<T, object>> OrderByDesc { get; }
    // public Expression<Func<T, bool>> MinPrice { get; }
    // public Expression<Func<T, bool>> MaxPrice { get; }
    public int Take { get; }
    public int Skip { get; }
}