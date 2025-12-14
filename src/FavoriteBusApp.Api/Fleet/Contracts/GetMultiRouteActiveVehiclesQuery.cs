using FavoriteBusApp.Api.Common;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public record GetMultipleVehicleLocationsQuery()
    : IRequest<OperationResult<Dictionary<string, ActiveVehicleDto[]>>>
{
    public required string[] RouteNames { get; init; }
}
