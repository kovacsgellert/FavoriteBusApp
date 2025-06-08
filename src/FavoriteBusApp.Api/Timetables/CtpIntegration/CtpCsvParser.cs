using System.Globalization;
using System.Threading.Tasks;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;

namespace FavoriteBusApp.Api.Timetables.CtpIntegration;

public interface ICtpCsvParser
{
    Task<CtpDailyTimetable> ParseCsvFile(string routeName, string filePath);
    CtpDailyTimetable ParseCsv(string routeName, string csvContent);
}

public class CtpCsvParser : ICtpCsvParser
{
    private readonly ILogger<CtpCsvParser> _logger;

    public CtpCsvParser(ILogger<CtpCsvParser> logger)
    {
        _logger = logger;
    }

    private static readonly Dictionary<string, string> _csvDayTypeMap = new()
    {
        { "Luni-Vineri", DayTypeConstants.Weekdays },
        { "Sambata", DayTypeConstants.Saturday },
        { "Duminica", DayTypeConstants.Sunday },
    };

    public async Task<CtpDailyTimetable> ParseCsvFile(string routeName, string filePath)
    {
        var csvContent = await File.ReadAllTextAsync(filePath);
        return ParseCsv(routeName, csvContent);
    }

    public CtpDailyTimetable ParseCsv(string routeName, string csvContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(routeName, nameof(routeName));
        ArgumentException.ThrowIfNullOrWhiteSpace(csvContent, nameof(csvContent));

        var lines = ParseLines(csvContent);

        if (lines.Length < 5)
            throw new ArgumentException(
                "CSV content does not contain enough lines for a valid timetable"
            );

        var timetable = new CtpDailyTimetable
        {
            RouteName = routeName,
            RouteLongName = ParseHeaderLine(lines[0]),
            DayType = _csvDayTypeMap[ParseHeaderLine(lines[1])],
            ValidFromDate = ParseDate(ParseHeaderLine(lines[2])),
            InStopName = ParseHeaderLine(lines[3]),
            OutStopName = ParseHeaderLine(lines[4]),
        };

        for (int i = 5; i < lines.Length; i++)
        {
            var times = lines[i].Split(',');

            if (times.Length < 2)
            {
                _logger.LogWarning($"Skipping line {i + 1} due to insufficient data: {lines[i]}");
                continue;
            }

            if (TimeOnly.TryParse(times[0], out var inTime))
                timetable.InStopTimes.Add(inTime);

            if (TimeOnly.TryParse(times[1], out var outTime))
                timetable.OutStopTimes.Add(outTime);
        }

        return timetable;
    }

    private static string[] ParseLines(string csvContent)
    {
        csvContent = csvContent
            .Trim()
            .Replace("\r\n", "\n") // Normalize Windows line endings
            .Replace("\r", "\n"); // Normalize old Mac line endings

        var lines = csvContent.Split("\n", StringSplitOptions.RemoveEmptyEntries);
        return lines;
    }

    private static string ParseHeaderLine(string line)
    {
        var parts = line.Split(',', 2);
        return parts.Length > 1 ? parts[1].Trim() : string.Empty;
    }

    private static DateOnly ParseDate(string dateStr)
    {
        dateStr = dateStr.Trim().Replace(',', '.');

        if (
            !DateOnly.TryParseExact(
                dateStr,
                "dd.MM.yyyy",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var date
            )
        )
        {
            throw new ArgumentException(
                $"Invalid date format: {dateStr}. Expected format is DD.MM.YYYY."
            );
        }

        return date;
    }
}
