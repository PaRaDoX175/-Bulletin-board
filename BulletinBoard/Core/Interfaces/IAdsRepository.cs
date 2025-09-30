public interface IAdsRepository
{
    Task Add(Ad ad);
    Task<List<Ad>> FindUsersAds(string userId);
    Task<List<Ad>> FindAllAds();
    Task DeleteAd(string adId);
    Task<int> GetCount(string search, string category);
    Task<List<Ad>> GetAdsWithSpec(BaseSpecification<Ad> ad);
}