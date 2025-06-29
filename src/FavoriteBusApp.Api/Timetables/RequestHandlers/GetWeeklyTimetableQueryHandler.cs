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

        List<CtpDailyTimetable> dailyTimetables = [];
        if (weekdaysTimetable != null)
            dailyTimetables.Add(weekdaysTimetable);
        if (saturdayTimetable != null)
            dailyTimetables.Add(saturdayTimetable);
        if (sundayTimetable != null)
            dailyTimetables.Add(sundayTimetable);

        if (dailyTimetables.Count == 0)
            return OperationResult<CtpWeeklyTimeTable>.Error(
                $"No timetables found for route: {request.RouteName}"
            );

        var weeklyTimetable = new CtpWeeklyTimeTable
        {
            RouteName = dailyTimetables[0].RouteName,
            RouteLongName = dailyTimetables[0].RouteLongName,
            DailyTimetables = dailyTimetables.ToArray(),
        };

        await _cache.SetAsync(cacheKey, weeklyTimetable, TimeSpan.FromDays(7));

        return OperationResult<CtpWeeklyTimeTable>.Ok(weeklyTimetable);
    }
}
