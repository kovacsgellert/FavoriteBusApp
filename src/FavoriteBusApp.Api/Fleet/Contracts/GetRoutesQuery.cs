using FavoriteBusApp.Api.Common;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public class GetRoutesQuery : IRequest<OperationResult<RouteDto[]>>
{
    public bool ForceRefresh { get; set; } = false;
}
