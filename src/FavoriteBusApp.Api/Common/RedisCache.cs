using StackExchange.Redis;

namespace FavoriteBusApp.Api.Common;

public interface ICache
{
    Task<T?> GetAsync<T>(string key)
        where T : class;
    Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        where T : class;
    Task RemoveAsync(string key);
}

public class RedisCache : ICache
{
    private readonly IConnectionMultiplexer _redisClient;

    public RedisCache(IConnectionMultiplexer redisClient)
    {
        _redisClient = redisClient;
    }

    public async Task<T?> GetAsync<T>(string key)
        where T : class
    {
        var db = _redisClient.GetDatabase();
        var value = await db.StringGetAsync(key);
        return value.HasValue ? JsonSerializer.Deserialize<T>(value.ToString()) : null;
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        where T : class
    {
        var db = _redisClient.GetDatabase();
        var jsonValue = JsonSerializer.Serialize(value);
        await db.StringSetAsync(key, jsonValue, expiration);
    }

    public async Task RemoveAsync(string key)
    {
        var db = _redisClient.GetDatabase();
        await db.KeyDeleteAsync(key);
    }
}
