using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;
using StackExchange.Redis;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetActiveVehiclesQueryHandler
    : IRequestHandler<GetActiveVehiclesQuery, OperationResult<ActiveVehicleDto[]>>
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

    public async Task<OperationResult<ActiveVehicleDto[]>> Handle(
        GetActiveVehiclesQuery request,
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
            var cachedVehicles = JsonSerializer.Deserialize<ActiveVehicleDto[]>(cachedJson)!;
            return OperationResult<ActiveVehicleDto[]>.Ok(cachedVehicles);
        }

        var routes = await GetRoutes();
        var trips = await GetTrips();
        var activeVehicles = (await _tranzyClient.GetVehicles())
            .Where(v =>
                v.RouteId.HasValue
                && !string.IsNullOrEmpty(v.TripId)
                && v.Timestamp > DateTime.UtcNow.AddMinutes(-5)
            )
            .ToArray();

        ActiveVehicleDto[] result = [];

        foreach (var activeVehiclesPerRoute in activeVehicles.GroupBy(v => v.RouteId))
        {
            var routeName = routes
                .FirstOrDefault(r => r.RouteId == activeVehiclesPerRoute.Key)
                ?.RouteShortName.ToUpperInvariant();

            // for some reason this can happen, don't ask me why
            if (string.IsNullOrEmpty(routeName))
                continue;

            var routeTrips = trips.Where(t => t.RouteId == activeVehiclesPerRoute.Key).ToArray();
            var vehicleDtos = activeVehiclesPerRoute
                .Select(v => CreateActiveVehicleDto(v, routeName, routeTrips))
                .ToArray();

            await redisDb.StringSetAsync(
                $"active-vehicles:{routeName}",
                JsonSerializer.Serialize(vehicleDtos),
                TimeSpan.FromSeconds(19) // clients are polling every 20 seconds
            );

            if (request.RouteName == routeName)
                result = vehicleDtos;
        }

        return OperationResult<ActiveVehicleDto[]>.Ok(result);
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

    private async Task<TranzyTrip[]> GetTrips()
    {
        var cacheKey = $"trips";
        var redisDb = _redisClient.GetDatabase();
        var cachedJson = (await redisDb.StringGetAsync(cacheKey)).ToString();

        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cachedTrips = JsonSerializer.Deserialize<TranzyTrip[]>(cachedJson)!;
            return cachedTrips;
        }

        var trips = await _tranzyClient.GetTrips();

        await redisDb.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(trips),
            TimeSpan.FromDays(7)
        );

        return trips;
    }

    private ActiveVehicleDto CreateActiveVehicleDto(
        TranzyVehicle vehicle,
        string routeName,
        TranzyTrip[] routeTrips
    )
    {
        var fromStop =
            routeTrips.FirstOrDefault(t => t.TripId != vehicle.TripId)?.TripHeadsign ?? "-";
        var toStop =
            routeTrips.FirstOrDefault(t => t.TripId == vehicle.TripId)?.TripHeadsign ?? "-";

        return new ActiveVehicleDto
        {
            Label = vehicle.Label,
            RouteName = routeName,
            Latitude = vehicle.Latitude,
            Longitude = vehicle.Longitude,
            Timestamp = vehicle.Timestamp,
            Speed = vehicle.Speed,
            TripId = vehicle.TripId!,
            FromStop = fromStop,
            ToStop = toStop,
            VehicleType = vehicle.VehicleType,
            BikeAccessible = vehicle.BikeAccessible,
            WheelchairAccessible = vehicle.WheelchairAccessible,
        };
    }
}
