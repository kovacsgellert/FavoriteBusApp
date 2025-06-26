using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

namespace FavoriteBusApp.Api.Timetables.RequestHandlers;

public class GetWeeklyTimetableQueryHandler
    : IRequestHandler<GetWeeklyTimetableQuery, OperationResult<CtpWeeklyTimeTable>>
{
    private readonly ICtpCsvClient _csvClient;
    private readonly ICache _cache;

    public GetWeeklyTimetableQueryHandler(ICtpCsvClient csvClient, ICache cache)
    {
        _csvClient = csvClient;
        _cache = cache;
    }

    public async Task<OperationResult<CtpWeeklyTimeTable>> Handle(
        GetWeeklyTimetableQuery request,
        CancellationToken cancellationToken
    )
    {
        request.RouteName = request.RouteName.Trim().ToUpperInvariant();

        var cacheKey = $"weekly_timetables:{request.RouteName}";
        var cachedTimetable = await _cache.GetAsync<CtpWeeklyTimeTable>(cacheKey);
        if (cachedTimetable != null && !request.ForceRefresh)
            return OperationResult<CtpWeeklyTimeTable>.Ok(cachedTimetable);

        var weekdaysTimetable = await _csvClient.GetDailyTimetable(
            request.RouteName,
            DayTypeConstants.Weekdays
        );

        var saturdayTimetable = await _csvClient.GetDailyTimetable(
            request.RouteName,
            DayTypeConstants.Saturday
        );

        var sundayTimetable = await _csvClient.GetDailyTimetable(
            request.RouteName,
            DayTypeConstants.Sunday
        );

        var weeklyTimetable = new CtpWeeklyTimeTable
        {
            RouteName = weekdaysTimetable.RouteName,
            RouteLongName = weekdaysTimetable.RouteLongName,
            DailyTimetables = [weekdaysTimetable, saturdayTimetable, sundayTimetable],
        };

        await _cache.SetAsync(cacheKey, weeklyTimetable, TimeSpan.FromDays(7));

        return OperationResult<CtpWeeklyTimeTable>.Ok(weeklyTimetable);
    }
}
