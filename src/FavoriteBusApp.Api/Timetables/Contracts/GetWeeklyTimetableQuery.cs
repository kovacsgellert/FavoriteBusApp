using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.Contracts;

public record GetWeeklyTimetableQuery : IRequest<OperationResult<CtpWeeklyTimeTable>>
{
    public required string RouteName { get; init; }
    public bool ForceRefresh { get; init; } = false;
}
