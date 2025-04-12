using System.Globalization;
using FavoriteBusApp.Api.Timetables.Models;

namespace FavoriteBusApp.Api.Timetables;

public class CtpCsvParser
{
    private static readonly Dictionary<string, string> _csvDayTypeMap = new()
    {
        { "Luni-Vineri", TimetableDayTypeConstants.Weekdays },
        { "Sambata", TimetableDayTypeConstants.Saturday },
        { "Duminica", TimetableDayTypeConstants.Sunday },
    };

    public CtpDailyTimetable ParseCsvFile(string filePath)
    {
        // Read all content from the CSV file
        string csvContent = File.ReadAllText(filePath);
        return ParseCsv(csvContent);
    }

    public CtpDailyTimetable ParseCsv(string routeName, string csvContent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(routeName, nameof(routeName));
        ArgumentException.ThrowIfNullOrWhiteSpace(csvContent, nameof(csvContent));

        var lines = csvContent.Split('\n', StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length < 5)
            throw new ArgumentException(
                "CSV content does not contain enough lines for a valid timetable"
            );

        var timetable = new CtpDailyTimetable
        {
            RouteName = ParseHeaderLine(lines[0]),
            RouteLongName = ParseHeaderLine(lines[1]),
            ValidFromDate = ParseDate(ParseHeaderLine(lines[2])),
            InStopName = ParseHeaderLine(lines[3]),
            OutStopName = ParseHeaderLine(lines[4]),
        };

        for (int i = 5; i < lines.Length; i++)
        {
            var times = lines[i].Split(',');
            if (TimeOnly.TryParse(times[0], out var inTime))
                timetable.InStopTimes.Add(inTime);

            if (TimeOnly.TryParse(times[1], out var outTime))
                timetable.OutStopTimes.Add(outTime);
        }

        return timetable;
    }

    private static string ParseHeaderLine(string line)
    {
        var parts = line.Split(',', 2);
        return parts.Length > 1 ? parts[1].Trim() : string.Empty;
    }

    private static DateOnly ParseDate(string dateStr)
    {
        // Expected format: DD.MM.YYYY
        if (
            DateOnly.TryParseExact(
                dateStr,
                "dd.MM.yyyy",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out var date
            )
        )
        {
            return date;
        }

        return DateOnly.FromDateTime(DateTime.MinValue);
    }
}
