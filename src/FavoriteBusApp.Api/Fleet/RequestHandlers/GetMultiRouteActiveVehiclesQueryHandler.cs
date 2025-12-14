using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetMultiRouteActiveVehiclesQueryHandler
    : IRequestHandler<
        GetMultipleVehicleLocationsQuery,
        OperationResult<Dictionary<string, ActiveVehicleDto[]>>
    >
{
    private readonly ITranzyClient _tranzyClient;

    public GetMultiRouteActiveVehiclesQueryHandler(ITranzyClient tranzyClient)
    {
        _tranzyClient = tranzyClient;
    }

    public async Task<OperationResult<Dictionary<string, ActiveVehicleDto[]>>> Handle(
        GetMultipleVehicleLocationsQuery request,
        CancellationToken cancellationToken
    )
    {
        request = request with
        {
            RouteNames = request
                .RouteNames.Select(r => r.Trim().ToUpperInvariant())
                .Where(r => !string.IsNullOrEmpty(r))
                .Distinct()
                .ToArray(),
        };

        var routes = (await _tranzyClient.GetRoutes())
            .Where(r => request.RouteNames.Contains(r.RouteShortName.ToUpperInvariant()))
            .ToArray();

        if (routes.Length == 0)
            return OperationResult<Dictionary<string, ActiveVehicleDto[]>>.Error("No routes found");

        var activeVehicles = (await _tranzyClient.GetVehicles())
            .Where(v =>
                routes.Any(route => route.RouteId == v.RouteId)
                && !string.IsNullOrEmpty(v.TripId)
                && v.Timestamp > DateTime.UtcNow.AddMinutes(-5)
            )
            .ToArray();

        if (activeVehicles.Length == 0)
            return OperationResult<Dictionary<string, ActiveVehicleDto[]>>.Ok([]);

        var trips = await _tranzyClient.GetTrips();

        var result = activeVehicles
            .GroupBy(v => v.RouteId)
            .ToDictionary(
                g => routes.First(r => r.RouteId == g.Key).RouteShortName.ToUpperInvariant(),
                g =>
                    g.Select(v =>
                            v.ToActiveVehicleDto(
                                routes
                                    .First(r => r.RouteId == g.Key)
                                    .RouteShortName.ToUpperInvariant(),
                                trips
                            )
                        )
                        .ToArray()
            );

        return OperationResult<Dictionary<string, ActiveVehicleDto[]>>.Ok(result);
    }
}
