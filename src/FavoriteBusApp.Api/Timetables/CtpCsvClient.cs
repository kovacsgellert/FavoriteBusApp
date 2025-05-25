using FavoriteBusApp.Api.Timetables.Models;

namespace FavoriteBusApp.Api.Timetables;

public class CtpCsvClient
{
    private readonly HttpClient _httpClient;
    private readonly CtpCsvParser _csvParser;
    private const string _baseRefererUrl =
        "https://ctpcj.ro/index.php/ro/orare-linii/linii-urbane/linia-";
    private const string _baseCsvUrl = "https://ctpcj.ro/orare/csv/orar_";

    private static readonly Dictionary<string, string> _urlDayTypeMap = new()
    {
        { DayTypeConstants.Weekdays, "lv" },
        { DayTypeConstants.Saturday, "s" },
        { DayTypeConstants.Sunday, "d" },
    };

    public CtpCsvClient(HttpClient httpClient, CtpCsvParser csvParser)
    {
        _httpClient = httpClient;
        _csvParser = csvParser;
    }

    public async Task<CtpDailyTimetable> DownloadDailyTimetable(
        string routeName,
        string dayType,
        string path
    )
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(routeName, nameof(routeName));
        ArgumentException.ThrowIfNullOrWhiteSpace(dayType, nameof(dayType));
        ArgumentException.ThrowIfNullOrWhiteSpace(path, nameof(path));

        if (!_urlDayTypeMap.ContainsKey(dayType))
            throw new ArgumentException($"Invalid day type: {dayType}", nameof(dayType));

        var content = await GetCsvContent(routeName, dayType);
        File.WriteAllText(Path.Combine(path, $"timetable_{routeName}_{dayType}.csv"), content);
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
