using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.RequestHandlers;

public class DownloadWeeklyTimetableCommandHandler
    : IRequestHandler<DownloadWeeklyTimetableCommand, OperationResult<CtpWeeklyTimeTable>>
{
    private readonly CtpCsvClient _ctpCsvClient;
    private readonly CtpCsvParser _ctpCsvParser;

    public DownloadWeeklyTimetableCommandHandler(
        CtpCsvClient ctpCsvClient,
        CtpCsvParser ctpCsvParser
    )
    {
        _ctpCsvClient = ctpCsvClient;
        _ctpCsvParser = ctpCsvParser;
    }

    public async Task<OperationResult<CtpWeeklyTimeTable>> Handle(
        DownloadWeeklyTimetableCommand request,
        CancellationToken cancellationToken
    )
    {
        var timetablesDir = Path.Combine(Directory.GetCurrentDirectory(), @"timetables");

        if (!Directory.Exists(timetablesDir))
            Directory.CreateDirectory(timetablesDir);

        var weekdaysFilePath = Path.Combine(
            timetablesDir,
            $"{request.RouteName}_{DayTypeConstants.Weekdays}.csv"
        );
        var saturdayFilePath = Path.Combine(
            timetablesDir,
            $"{request.RouteName}_{DayTypeConstants.Saturday}.csv"
        );
        var sundayFilePath = Path.Combine(
            timetablesDir,
            $"{request.RouteName}_{DayTypeConstants.Sunday}.csv"
        );

        var weekdaysTimetable = await _ctpCsvClient.DownloadDailyTimetable(
            request.RouteName,
            DayTypeConstants.Weekdays,
            weekdaysFilePath
        );
        var saturdayTimetable = await _ctpCsvClient.DownloadDailyTimetable(
            request.RouteName,
            DayTypeConstants.Saturday,
            saturdayFilePath
        );
        var sundayTimetable = await _ctpCsvClient.DownloadDailyTimetable(
            request.RouteName,
            DayTypeConstants.Sunday,
            sundayFilePath
        );

        return OperationResult<CtpWeeklyTimeTable>.Ok(
            new CtpWeeklyTimeTable
            {
                RouteName = weekdaysTimetable.RouteName,
                RouteLongName = weekdaysTimetable.RouteLongName,
                DailyTimetables = [weekdaysTimetable, saturdayTimetable, sundayTimetable],
            }
        );
    }
}
