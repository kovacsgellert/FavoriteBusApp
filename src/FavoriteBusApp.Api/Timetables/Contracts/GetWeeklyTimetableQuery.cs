using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.Contracts;

public class GetWeeklyTimetableQuery : IRequest<OperationResult<CtpWeeklyTimeTable>>
{
    public required string RouteName { get; set; }
    public bool ForceRefresh { get; set; } = false;
}
