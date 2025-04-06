using FavoriteBusApp.Data;
using FavoriteBusApp.Data.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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

// Register HttpClient for CtpCsvClient
builder.Services.AddHttpClient();
builder.Services.AddScoped<CtpCsvClient>();
builder.Services.AddScoped<CtpCsvParser>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("AllowAllOrigins");
}
else
{
    app.UseHttpsRedirection();
}

app.UseHttpsRedirection();

app.MapGet(
        "/api/timetable/weekly/25",
        (CtpCsvClient csvClient, CtpCsvParser csvParser) =>
        {
            try
            {
                // Create the timetables directory if it doesn't exist
                string timetablesDir = Path.Combine(Directory.GetCurrentDirectory(), "timetables");
                //Directory.CreateDirectory(timetablesDir);

                // Download the CSV files for bus 25
                //await csvClient.DownloadCsvFiles("25", timetablesDir);

                // Parse the downloaded CSV files
                var weekdaysTimetable = csvParser.ParseCsvFile(
                    Path.Combine(timetablesDir, "25_weekdays.csv")
                );
                var saturdayTimetable = csvParser.ParseCsvFile(
                    Path.Combine(timetablesDir, "25_saturday.csv")
                );
                var sundayTimetable = csvParser.ParseCsvFile(
                    Path.Combine(timetablesDir, "25_sunday.csv")
                );

                // Create and return the weekly timetable
                var weeklyTimetable = new CtpWeeklyTimeTable
                {
                    RouteName = "25",
                    RouteLongName = weekdaysTimetable.RouteLongName,
                    WeekDays = weekdaysTimetable,
                    Saturday = saturdayTimetable,
                    Sunday = sundayTimetable,
                };

                return Results.Ok(weeklyTimetable);
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error retrieving timetable: {ex.Message}");
            }
        }
    )
    .WithName("GetWeeklyTimetable");

app.Run();
