using FavoriteBusApp.Api.Common;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public class GetActiveVehiclesQuery : IRequest<OperationResult<ActiveVehicleDto[]>>
{
    public required string RouteName { get; set; }
}
