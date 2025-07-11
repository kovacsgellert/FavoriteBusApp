using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;

namespace FavoriteBusApp.Api.Timetables.CtpIntegration;

public interface ICtpCsvClient
{
    Task<CtpDailyTimetable?> GetDailyTimetable(string routeName, string dayType);
}

public class CtpCsvClient : ICtpCsvClient
{
    private readonly HttpClient _httpClient;
    private readonly ICtpCsvParser _csvParser;
    private const string _baseRefererUrl =
        "https://ctpcj.ro/index.php/ro/orare-linii/linii-urbane/linia-";
    private const string _baseCsvUrl = "https://ctpcj.ro/orare/csv/orar_";

    private static readonly Dictionary<string, string> _urlDayTypeMap = new()
    {
        { DayTypeConstants.Weekdays, "lv" },
        { DayTypeConstants.Saturday, "s" },
        { DayTypeConstants.Sunday, "d" },
    };

    public CtpCsvClient(HttpClient httpClient, ICtpCsvParser csvParser)
    {
        _httpClient = httpClient;
        _csvParser = csvParser;
    }

    public async Task<CtpDailyTimetable?> GetDailyTimetable(string routeName, string dayType)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(routeName, nameof(routeName));
        ArgumentException.ThrowIfNullOrWhiteSpace(dayType, nameof(dayType));

        if (!_urlDayTypeMap.ContainsKey(dayType))
            throw new ArgumentException($"Invalid day type: {dayType}", nameof(dayType));

        string content;
        try
        {
            content = await GetCsvContent(routeName, dayType);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }

        var timetable = _csvParser.ParseCsv(routeName, content);
        return timetable;
    }

    private async Task<string> GetCsvContent(string routeName, string dayType)
    {
        var url = $"{_baseCsvUrl}{routeName}_{_urlDayTypeMap[dayType]}.csv";
        var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, url);
        httpRequestMessage.Headers.Add("referer", $"{_baseRefererUrl}{routeName}");

        var response = await _httpClient.SendAsync(httpRequestMessage);

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        return content;
    }
}
