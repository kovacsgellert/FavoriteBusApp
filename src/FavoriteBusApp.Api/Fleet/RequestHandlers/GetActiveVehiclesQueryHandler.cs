using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetActiveVehiclesQueryHandler
    : IRequestHandler<GetActiveVehiclesQuery, OperationResult<ActiveVehicleDto[]>>
{
    private readonly ITranzyClient _tranzyClient;

    public GetActiveVehiclesQueryHandler(ITranzyClient tranzyClient)
    {
        _tranzyClient = tranzyClient;
    }

    public async Task<OperationResult<ActiveVehicleDto[]>> Handle(
        GetActiveVehiclesQuery request,
        CancellationToken cancellationToken
    )
    {
        request = request with { RouteName = request.RouteName.Trim().ToUpperInvariant() };

        var route = (await _tranzyClient.GetRoutes()).FirstOrDefault(r =>
            r.RouteShortName.ToUpperInvariant() == request.RouteName
        );

        if (route == null)
            return OperationResult<ActiveVehicleDto[]>.Error("Route not found");

        var vehicles = await _tranzyClient.GetVehicles();

        var activeVehicles = vehicles
            .Where(v =>
                v.RouteId == route.RouteId
                && !string.IsNullOrEmpty(v.TripId)
                && v.Timestamp > DateTime.UtcNow.AddMinutes(-5)
            )
            .ToArray();

        if (activeVehicles.Length == 0)
            return OperationResult<ActiveVehicleDto[]>.Ok([]);

        var trips = (await _tranzyClient.GetTrips())
            .Where(t => t.RouteId == route.RouteId)
            .ToArray();

        var result = activeVehicles
            .Select(v => v.ToActiveVehicleDto(route.RouteShortName.ToUpperInvariant(), trips))
            .ToArray();

        return OperationResult<ActiveVehicleDto[]>.Ok(result);
    }
}
