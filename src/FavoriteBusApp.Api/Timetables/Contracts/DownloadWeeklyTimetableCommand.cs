using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.Contracts;

public class DownloadWeeklyTimetableCommand : IRequest<OperationResult<CtpWeeklyTimeTable>>
{
    public required string RouteName { get; set; }
}
