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
        var cacheKey = $"active-vehicles:{request.RouteName}";
        var redisDb = _redisClient.GetDatabase();
        var cachedJson = (await redisDb.StringGetAsync(cacheKey)).ToString();

        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cachedVehicles = JsonSerializer.Deserialize<TranzyVehicle[]>(cachedJson)!;
            return OperationResult<TranzyVehicle[]>.Ok(cachedVehicles);
        }

        var vehicles = await _tranzyClient.GetVehicles(TranzyConstants.Bus25RouteId);

        await redisDb.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(vehicles),
            TimeSpan.FromSeconds(30)
        );

        return OperationResult<TranzyVehicle[]>.Ok(vehicles);
    }
}
