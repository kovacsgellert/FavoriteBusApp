using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;
using StackExchange.Redis;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetActiveVehiclesQueryHandler
    : IRequestHandler<Contracts.GetActiveVehiclesQuery, OperationResult<TranzyVehicle[]>>
{
    private readonly ITranzyClient _tranzyClient;
    private readonly IConnectionMultiplexer _redisClient;

    public GetActiveVehiclesQueryHandler(
        ITranzyClient tranzyClient,
        IConnectionMultiplexer redisClient
    )
    {
        _tranzyClient = tranzyClient;
        _redisClient = redisClient;
    }

    public async Task<OperationResult<TranzyVehicle[]>> Handle(
        Contracts.GetActiveVehiclesQuery request,
        CancellationToken cancellationToken
    )
    {
        request.RouteName = request.RouteName.Trim().ToUpperInvariant();

        var redisDb = _redisClient.GetDatabase();
        var cachedJson = (
            await redisDb.StringGetAsync($"active-vehicles:{request.RouteName}")
        ).ToString();

        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cachedVehicles = JsonSerializer.Deserialize<TranzyVehicle[]>(cachedJson)!;
            return OperationResult<TranzyVehicle[]>.Ok(cachedVehicles);
        }

        var activeVehicles = (await _tranzyClient.GetVehicles())
            .Where(v => v.RouteId.HasValue && v.Timestamp > DateTime.UtcNow.AddMinutes(-5))
            .ToArray();
        var routes = await GetRoutes();
        TranzyVehicle[] result = [];

        foreach (var activeVehiclesPerRoute in activeVehicles.GroupBy(v => v.RouteId))
        {
            var routeName = routes
                .FirstOrDefault(r => r.RouteId == activeVehiclesPerRoute.Key)
                ?.RouteShortName;

            // for some reason this can happen, don't ask me why
            if (string.IsNullOrEmpty(routeName))
                continue;

            await redisDb.StringSetAsync(
                $"active-vehicles:{routeName}",
                JsonSerializer.Serialize(activeVehiclesPerRoute.ToArray()),
                TimeSpan.FromSeconds(30)
            );

            if (request.RouteName == routeName)
                result = activeVehiclesPerRoute.ToArray();
        }

        return OperationResult<TranzyVehicle[]>.Ok(result);
    }

    private async Task<TranzyRoute[]> GetRoutes()
    {
        var cacheKey = $"routes";
        var redisDb = _redisClient.GetDatabase();
        var cachedJson = (await redisDb.StringGetAsync(cacheKey)).ToString();

        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cachedRoutes = JsonSerializer.Deserialize<TranzyRoute[]>(cachedJson)!;
            return cachedRoutes;
        }

        var routes = await _tranzyClient.GetRoutes();

        await redisDb.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(routes),
            TimeSpan.FromDays(7)
        );

        return routes;
    }
}
