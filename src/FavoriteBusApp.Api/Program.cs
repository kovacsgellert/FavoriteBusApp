using FavoriteBusApp.Api.Locations;
using FavoriteBusApp.Api.Timetables;
using FavoriteBusApp.Api.Timetables.Models;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    );
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new TimeOnlyConverter());
});

builder.Services.AddHttpClient<CtpCsvClient>();
builder.Services.AddScoped<CtpCsvClient>();
builder.Services.AddScoped<CtpCsvParser>();

builder.Services.Configure<TranzyOptions>(builder.Configuration.GetSection("Tranzy"));
builder.Services.AddHttpClient<TranzyClient>();
builder.Services.AddScoped<TranzyClient>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("AllowAllOrigins");
}
else
{
    app.UseHttpsRedirection();
}

app.MapGet(
        "/api/timetables",
        (CtpCsvParser csvParser) =>
        {
            try
            {
                string timetablesDir = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    @"..\..\assets"
                );

                var weekdaysTimetable = csvParser.ParseCsvFile(
                    "25",
                    Path.Combine(timetablesDir, "timetable_25_weekdays.csv")
                );
                var saturdayTimetable = csvParser.ParseCsvFile(
                    "25",
                    Path.Combine(timetablesDir, "timetable_25_saturday.csv")
                );
                var sundayTimetable = csvParser.ParseCsvFile(
                    "25",
                    Path.Combine(timetablesDir, "timetable_25_sunday.csv")
                );

                var weeklyTimetable = new CtpWeeklyTimeTable
                {
                    RouteName = "25",
                    RouteLongName = weekdaysTimetable.RouteLongName,
                    DailyTimetables = [weekdaysTimetable, saturdayTimetable, sundayTimetable],
                };

                return Results.Ok(weeklyTimetable);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error retrieving timetable: {ex.Message}");
            }
        }
    )
    .WithName("GetTimetables");

app.MapGet(
        "/api/vehicles",
        async (TranzyClient tranzyClient) =>
        {
            try
            {
                var vehicles = await tranzyClient.GetVehicles(TranzyConstants.Bus25RouteId);
                return Results.Ok(vehicles);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error retrieving vehicles: {ex.Message}");
            }
        }
    )
    .WithName("GetVehicles");

app.MapGet(
        "/api/timetables/download",
        async (CtpCsvClient csvClient) =>
        {
            try
            {
                string timetablesDir = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    @"..\..\assets"
                );

                var weekdaysTimetable = await csvClient.GetDailyTimetable(
                    "25",
                    DayTypeConstants.Weekdays
                );
                var saturdayTimetable = await csvClient.GetDailyTimetable(
                    "25",
                    DayTypeConstants.Saturday
                );
                var sundayTimetable = csvClient.GetDailyTimetable("25", DayTypeConstants.Sunday);

                return Results.Ok(
                    new
                    {
                        weekdaysTimetable,
                        saturdayTimetable,
                        sundayTimetable,
                    }
                );
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error downloading timetable: {ex.Message}");
            }
        }
    )
    .WithName("DownloadTimetables");

app.Run();
