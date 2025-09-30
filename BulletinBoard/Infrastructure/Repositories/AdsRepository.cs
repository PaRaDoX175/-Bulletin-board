
using Infrastructure;
using Microsoft.EntityFrameworkCore;

public class AdsRepository : IAdsRepository
{
    private readonly AppIdentityDbContext _context;
    public AdsRepository(AppIdentityDbContext context)
    {
        _context = context;
    }

    public async Task Add(Ad ad)
    {
        await _context.Ads.AddAsync(ad);
        await _context.SaveChangesAsync();
    }

    public Task DeleteAd(string adId)
    {
        throw new NotImplementedException();
    }

    public async Task<List<Ad>> FindAllAds()
    {
        return await _context.Ads.ToListAsync();
    }

    public async Task<List<Ad>> FindUsersAds(string userId)
    {
        return await _context.Ads.Where(ad => ad.UserId == userId).ToListAsync();
    }

    public async Task<List<Ad>> GetAdsWithSpec(BaseSpecification<Ad> ad)
    {
        return await ApplySpecification(ad).ToListAsync();
    }

    public IQueryable<Ad> ApplySpecification(BaseSpecification<Ad> specification)
    {
        return SpecificationEvaluator<Ad>.GetQuery(_context.Ads, specification);
    }

    public async Task<int> GetCount(string search, string category = "")
    {
        return await _context.Ads
            .Where(x => (string.IsNullOrEmpty(search) || x.Title.ToLower().Contains(search) || x.Description.ToLower().Contains(search))
            && (string.IsNullOrEmpty(category) || x.Category == category)).CountAsync();
    }
}