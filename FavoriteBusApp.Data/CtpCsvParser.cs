namespace FavoriteBusApp.Data;

using System.Globalization;
using FavoriteBusApp.Data.Models;

public class CtpCsvParser
{
    public CtpDailyTimetable ParseCsvFile(string filePath)
    {
        // Read all content from the CSV file
        string csvContent = File.ReadAllText(filePath);
        return ParseCsv(csvContent);
    }

    public CtpDailyTimetable ParseCsv(string csvContent)
    {
        // Split content into lines
        var lines = csvContent.Split('\n', StringSplitOptions.RemoveEmptyEntries);

        if (lines.Length < 5)
        {
            throw new ArgumentException(
                "CSV content does not contain enough lines for a valid timetable"
            );
        }

        // Parse header information
        var routeInfo = ParseHeaderLine(lines[0]); // route_long_name
        var serviceName = ParseHeaderLine(lines[1]); // service_name
        var serviceStartInfo = ParseHeaderLine(lines[2]); // service_start
        var inStopInfo = ParseHeaderLine(lines[3]); // in_stop_name
        var outStopInfo = ParseHeaderLine(lines[4]); // out_stop_name

        // Create daily timetable object
        var timetable = new CtpDailyTimetable
        {
            RouteName = serviceName,
            RouteLongName = routeInfo,
            ValidFromDate = ParseDate(serviceStartInfo),
            InStopName = inStopInfo,
            OutStopName = outStopInfo,
        };

        // Parse time entries (starting from line 5)
        for (int i = 5; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (string.IsNullOrEmpty(line))
                continue;

            var times = line.Split(',');
            if (times.Length == 2)
            {
                if (TimeOnly.TryParse(times[0], out var inTime))
                {
                    timetable.InStopTimes.Add(inTime);
                }

                if (TimeOnly.TryParse(times[1], out var outTime))
                {
                    timetable.OutStopTimes.Add(outTime);
                }
            }
        }

        return timetable;
    }

    private string ParseHeaderLine(string line)
    {
        var parts = line.Split(',', 2);
        return parts.Length > 1 ? parts[1].Trim() : string.Empty;
    }

    private DateOnly ParseDate(string dateStr)
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

        return DateOnly.FromDateTime(DateTime.Now); // Fallback to today if parsing fails
    }
}
