using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Fleet.RequestHandlers;

public class GetRoutesQueryHandler : IRequestHandler<GetRoutesQuery, OperationResult<RouteDto[]>>
{
    private readonly ITranzyClient _tranzyClient;

    public GetRoutesQueryHandler(ITranzyClient tranzyClient)
    {
        _tranzyClient = tranzyClient;
    }

    public async Task<OperationResult<RouteDto[]>> Handle(
        GetRoutesQuery request,
        CancellationToken cancellationToken
    )
    {
        var routes = await _tranzyClient.GetRoutes();

        return OperationResult<RouteDto[]>.Ok(
            routes.Where(ShouldReturnRoute).Select(CreateRouteDto).OrderBy(r => r.Name).ToArray()
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

    private static bool ShouldReturnRoute(TranzyRoute route)
    {
        var upperCaseRouteName = route.RouteShortName.ToUpperInvariant();
        var upperCaseRouteLongName = route.RouteLongName.ToUpperInvariant();

        // show Untold special routes only in August
        if (!IsUntoldSeason() && upperCaseRouteName is "30U" or "101A")
            return false;

        // ignore routes reserved for pupils (Transport Elevi)
        if (upperCaseRouteName.Contains("TE") || upperCaseRouteLongName.StartsWith("TE"))
            return false;

        return true;
    }

    private static bool IsUntoldSeason()
    {
        return DateTime.UtcNow.Month == 8;
    }
}
