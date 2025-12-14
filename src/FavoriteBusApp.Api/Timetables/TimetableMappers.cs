using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;

namespace FavoriteBusApp.Api.Timetables;

public static class TimetableMappers
{
    public static DailyTimetableDto ToDailyTimetableDto(this CtpDailyTimetable timetable) =>
        new()
        {
            RouteName = timetable.RouteName,
            RouteLongName = timetable.RouteLongName,
            DayType = timetable.DayType,
            ValidFromDate = timetable.ValidFromDate,
            InStopName = timetable.InStopName,
            OutStopName = timetable.OutStopName,
            InStopTimes = [.. timetable.InStopTimes],
            OutStopTimes = [.. timetable.OutStopTimes],
        };
}
