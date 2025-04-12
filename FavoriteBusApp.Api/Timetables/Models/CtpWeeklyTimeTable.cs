namespace FavoriteBusApp.Api.Timetables.Models;

public class CtpWeeklyTimeTable
{
    public required string RouteName { get; set; }
    public required string RouteLongName { get; set; }
    public required CtpDailyTimetable WeekDays { get; set; }
    public required CtpDailyTimetable Saturday { get; set; }
    public required CtpDailyTimetable Sunday { get; set; }
}
