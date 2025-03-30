namespace FavoriteBusApp.Data.Models;

public class CtpDailyTimetable
{
    public required string RouteName { get; set; }
    public required string RouteLongName { get; set; }
    public required DateOnly ValidFromDate { get; set; }
    public required string InStopName { get; set; }
    public required string OutStopName { get; set; }
    public List<TimeOnly> InStopTimes { get; set; } = [];
    public List<TimeOnly> OutStopTimes { get; set; } = [];
}
