using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.RequestHandlers;

public class GetWeeklyTimetableQueryHandler
    : IRequestHandler<GetWeeklyTimetableQuery, OperationResult<CtpWeeklyTimeTable>>
{
    private readonly CtpCsvParser _csvParser;

    public GetWeeklyTimetableQueryHandler(CtpCsvParser csvParser)
    {
        _csvParser = csvParser;
    }

    public async Task<OperationResult<CtpWeeklyTimeTable>> Handle(
        GetWeeklyTimetableQuery request,
        CancellationToken cancellationToken
    )
    {
        string timetablesDir = Path.Combine(Directory.GetCurrentDirectory(), @"timetables");

        if (!Directory.Exists(timetablesDir))
        {
            return OperationResult<CtpWeeklyTimeTable>.Fail(
                "Timetables directory does not exist. Please download the timetables first."
            );
        }

        var weekdaysTimetable = await _csvParser.ParseCsvFile(
            request.RouteName,
            Path.Combine(timetablesDir, $"{request.RouteName}_{DayTypeConstants.Weekdays}.csv")
        );
        var saturdayTimetable = await _csvParser.ParseCsvFile(
            request.RouteName,
            Path.Combine(timetablesDir, $"{request.RouteName}_{DayTypeConstants.Saturday}.csv")
        );
        var sundayTimetable = await _csvParser.ParseCsvFile(
            request.RouteName,
            Path.Combine(timetablesDir, $"{request.RouteName}_{DayTypeConstants.Sunday}.csv")
        );

        var weeklyTimetable = new CtpWeeklyTimeTable
        {
            RouteName = weekdaysTimetable.RouteName,
            RouteLongName = weekdaysTimetable.RouteLongName,
            DailyTimetables = [weekdaysTimetable, saturdayTimetable, sundayTimetable],
        };

        return OperationResult<CtpWeeklyTimeTable>.Ok(weeklyTimetable);
    }
}
