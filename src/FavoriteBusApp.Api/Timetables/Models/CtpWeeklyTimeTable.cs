namespace FavoriteBusApp.Api.Timetables.Models;

public class CtpWeeklyTimeTable
{
    public required string RouteName { get; set; }
    public required string RouteLongName { get; set; }
    public required CtpDailyTimetable[] DailyTimetables { get; set; } = [];
}
