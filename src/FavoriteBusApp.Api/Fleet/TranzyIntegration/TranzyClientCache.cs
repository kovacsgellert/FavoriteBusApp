using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

namespace FavoriteBusApp.Api.Fleet.TranzyIntegration;

// Cache layer put in front of TranzyClient in order to not hit the daily API limits (5000 requests/day)
public class TranzyClientCache : ITranzyClient
{
    private readonly ITranzyClient _decoratedTranzyClient;
    private readonly ICache _cache;

    public TranzyClientCache(
        [FromKeyedServices("TranzyClient")] ITranzyClient decoratedTranzyClient,
        ICache cache
    )
    {
        _decoratedTranzyClient = decoratedTranzyClient;
        _cache = cache;
    }

    public async Task<TranzyVehicle[]> GetVehicles()
    {
        var cacheKey = "tranzy-vehicles";

        var cachedVehicles = await _cache.GetAsync<TranzyVehicle[]>(cacheKey);
        if (cachedVehicles != null)
            return cachedVehicles;

        var vehicles = await _decoratedTranzyClient.GetVehicles();
        await _cache.SetAsync(cacheKey, vehicles, TimeSpan.FromSeconds(19)); // UI refreshes every 20s
        return vehicles;
    }

    public async Task<TranzyRoute[]> GetRoutes()
    {
        var cacheKey = "tranzy-routes";

        var cachedRoutes = await _cache.GetAsync<TranzyRoute[]>(cacheKey);
        if (cachedRoutes != null)
            return cachedRoutes;

        var routes = await _decoratedTranzyClient.GetRoutes();
        await _cache.SetAsync(cacheKey, routes, TimeSpan.FromDays(7));
        return routes;
    }

    public async Task<TranzyTrip[]> GetTrips()
    {
        var cacheKey = "tranzy-trips";

        var cachedTrips = await _cache.GetAsync<TranzyTrip[]>(cacheKey);
        if (cachedTrips != null)
            return cachedTrips;

        var trips = await _decoratedTranzyClient.GetTrips();
        await _cache.SetAsync(cacheKey, trips, TimeSpan.FromDays(7));
        return trips;
    }
}
