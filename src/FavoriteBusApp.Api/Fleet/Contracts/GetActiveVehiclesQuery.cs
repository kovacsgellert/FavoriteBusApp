using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.Contracts;

public class GetActiveVehiclesQuery : IRequest<OperationResult<TranzyVehicle[]>>
{
    public required string RouteName { get; set; }
}
