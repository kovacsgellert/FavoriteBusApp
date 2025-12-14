using FavoriteBusApp.Api.Common;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public record GetRoutesQuery : IRequest<OperationResult<RouteDto[]>>
{
    public bool ForceRefresh { get; init; } = false;
}
