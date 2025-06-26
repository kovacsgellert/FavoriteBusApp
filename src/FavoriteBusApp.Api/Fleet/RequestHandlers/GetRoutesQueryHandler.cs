using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetRoutesQueryHandler : IRequestHandler<GetRoutesQuery, OperationResult<RouteDto[]>>
{
    private readonly ITranzyClient _tranzyClient;
    private readonly ICache _cache;

    public GetRoutesQueryHandler(ITranzyClient tranzyClient, ICache cache)
    {
        _tranzyClient = tranzyClient;
        _cache = cache;
    }

    public async Task<OperationResult<RouteDto[]>> Handle(
        GetRoutesQuery request,
        CancellationToken cancellationToken
    )
    {
        var cachedRoutes = await _cache.GetAsync<TranzyRoute[]>("routes");
        if (cachedRoutes != null && !request.ForceRefresh)
            return OperationResult<RouteDto[]>.Ok(
                cachedRoutes.Select(CreateRouteDto).OrderBy(r => r.Name).ToArray()
            );

        var routes = await _tranzyClient.GetRoutes();
        await _cache.SetAsync("routes", routes, TimeSpan.FromDays(7));

        return OperationResult<RouteDto[]>.Ok(
            routes.Select(CreateRouteDto).OrderBy(r => r.Name).ToArray()
        );
    }

    private static RouteDto CreateRouteDto(TranzyRoute route)
    {
        return new RouteDto
        {
            Id = route.RouteId,
            Name = route.RouteShortName,
            LongName = route.RouteLongName,
            Type = route.RouteType switch
            {
                0 => "TRAM",
                3 => "BUS",
                11 => "TROLLEY",
                _ => "UNKNOWN",
            },
        };
    }
}
