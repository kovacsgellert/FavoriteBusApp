namespace FavoriteBusApp.Api.Timetables.Contracts;

public record WeeklyTimetableDto
{
    public required string RouteName { get; init; }
    public required string RouteLongName { get; init; }
    public required DailyTimetableDto[] DailyTimetables { get; init; } = [];
}
