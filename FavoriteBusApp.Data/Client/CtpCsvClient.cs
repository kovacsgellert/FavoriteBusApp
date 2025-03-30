namespace FavoriteBusApp.Data.Client;

public class CtpCsvClient
{
    private readonly HttpClient _httpClient;
    private const string BaseRefererUrl =
        "https://ctpcj.ro/index.php/ro/orare-linii/linii-urbane/linia-";
    private const string BaseCsvUrl = "https://ctpcj.ro/orare/csv/orar_";

    public CtpCsvClient(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public async Task DownloadCsvFiles(string busLineNumber, string outputDirectory)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(busLineNumber, nameof(busLineNumber));
        ArgumentException.ThrowIfNullOrWhiteSpace(outputDirectory, nameof(outputDirectory));

        Directory.CreateDirectory(outputDirectory);
        ConfigureRefererHeader(busLineNumber);

        await DownloadTimetable(
            busLineNumber,
            "lv",
            Path.Combine(outputDirectory, $"{busLineNumber}_weekdays.csv")
        );

        await DownloadTimetable(
            busLineNumber,
            "s",
            Path.Combine(outputDirectory, $"{busLineNumber}_saturday.csv")
        );

        await DownloadTimetable(
            busLineNumber,
            "d",
            Path.Combine(outputDirectory, $"{busLineNumber}_sunday.csv")
        );
    }

    private void ConfigureRefererHeader(string busLineNumber)
    {
        if (_httpClient.DefaultRequestHeaders.Contains("referer"))
            _httpClient.DefaultRequestHeaders.Remove("referer");

        _httpClient.DefaultRequestHeaders.Add("referer", $"{BaseRefererUrl}{busLineNumber}");
    }

    private async Task DownloadTimetable(string busLineNumber, string dayType, string outputPath)
    {
        string url = $"{BaseCsvUrl}{busLineNumber}_{dayType}.csv";
        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        await File.WriteAllTextAsync(outputPath, content);
    }
}
