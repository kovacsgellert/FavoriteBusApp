using FavoriteBusApp.Api.Common;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public record GetActiveVehiclesQuery : IRequest<OperationResult<ActiveVehicleDto[]>>
{
    public required string RouteName { get; init; }
}
