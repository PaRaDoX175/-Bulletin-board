public interface IAdsRepository
{
    Task Add(Ad ad);
    Task<List<Ad>> FindUsersAds(string userId);
    Task<List<Ad>> FindAllAds();
    Task DeleteAd(string adId, string userId);
    Task<int> GetCount(string search, string category, string userId);
    Task<List<Ad>> GetAdsWithSpec(BaseSpecification<Ad> ad);
}