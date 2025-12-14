namespace FavoriteBusApp.Api.Timetables.Contracts;

public record DailyTimetableDto
{
    public required string RouteName { get; init; }
    public required string RouteLongName { get; init; }
    public required string DayType { get; init; }
    public DateOnly? ValidFromDate { get; init; }
    public required string InStopName { get; init; }
    public required string OutStopName { get; init; }
    public List<TimeOnly> InStopTimes { get; init; } = [];
    public List<TimeOnly> OutStopTimes { get; init; } = [];
}
