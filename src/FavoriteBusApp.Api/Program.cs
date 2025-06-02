using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Locations;
using FavoriteBusApp.Api.Locations.Models;
using FavoriteBusApp.Api.Timetables;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
using FavoriteBusApp.Api.Timetables.CtpIntegration.Models;
using MediatR;

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

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());

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
        "/api/timetables/{routeName}",
        async (string routeName, IMediator mediator) =>
        {
            var result = await mediator.Send(new GetWeeklyTimetableQuery { RouteName = routeName });

            if (!result.IsValid)
            {
                result = await mediator.Send(
                    new DownloadWeeklyTimetableCommand { RouteName = routeName }
                );
            }
            return result.ToResult();
        }
    )
    .WithName("GetWeeklyTimetable");

app.MapGet(
        "/api/timetables/download/{routeName}",
        async (string routeName, IMediator mediator) =>
        {
            var result = await mediator.Send(
                new DownloadWeeklyTimetableCommand { RouteName = routeName }
            );
            return result.ToResult();
        }
    )
    .WithName("DownloadWeeklyTimetable");

app.MapGet(
        "/api/vehicles/{routeName}",
        async (string routeName, TranzyClient tranzyClient) =>
        {
            try
            {
                var vehicles = await tranzyClient.GetVehicles(TranzyConstants.Bus25RouteId);
                return OperationResult<TranzyVehicle[]>.Ok(vehicles!).ToResult();
            }
            catch (Exception ex)
            {
                return Results.Problem($"Error retrieving vehicles: {ex.Message}");
            }
        }
    )
    .WithName("GetVehicles");

app.Run();
