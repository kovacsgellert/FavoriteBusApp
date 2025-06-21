using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;
using StackExchange.Redis;

namespace FavoriteBusApp.Api.Timetables.RequestHandlers;

public class GetWeeklyTimetableQueryHandler
    : IRequestHandler<GetWeeklyTimetableQuery, OperationResult<CtpWeeklyTimeTable>>
{
    private readonly ICtpCsvClient _csvClient;
    private readonly IConnectionMultiplexer _redisClient;

    public GetWeeklyTimetableQueryHandler(
        ICtpCsvClient csvClient,
        IConnectionMultiplexer redisClient
    )
    {
        _csvClient = csvClient;
        _redisClient = redisClient;
    }

    public async Task<OperationResult<CtpWeeklyTimeTable>> Handle(
        GetWeeklyTimetableQuery request,
        CancellationToken cancellationToken
    )
    {
        request.RouteName = request.RouteName.Trim().ToUpperInvariant();

        var cacheKey = $"weekly_timatebles:{request.RouteName}";
        var redisDb = _redisClient.GetDatabase();

        var cachedJson = !request.ForceRefresh
            ? (await redisDb.StringGetAsync(cacheKey)).ToString()
            : null;

        if (!string.IsNullOrEmpty(cachedJson))
        {
            var cachedWeeklyTimetable = JsonSerializer.Deserialize<CtpWeeklyTimeTable>(cachedJson)!;
            return OperationResult<CtpWeeklyTimeTable>.Ok(cachedWeeklyTimetable);
        }

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

        await redisDb.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(weeklyTimetable),
            TimeSpan.FromDays(7)
        );

        return OperationResult<CtpWeeklyTimeTable>.Ok(weeklyTimetable);
    }
}
