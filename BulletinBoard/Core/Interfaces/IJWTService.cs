using Core.Entities;

namespace Core.Interfaces;

public interface IJWTService
{
    string GenerateToken(AppUser user);
}