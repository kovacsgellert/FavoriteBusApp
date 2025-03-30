namespace FavoriteBusApp.Data.Models;

public class CtpWeeklyTimeTable
{
    public required string LineNumber { get; set; }
    public required string RouteLongName { get; set; }
    public required CtpDailyTimetable WeekDays { get; set; }
    public required CtpDailyTimetable Saturday { get; set; }
    public required CtpDailyTimetable Sunday { get; set; }
}
