using FavoriteBusApp.Api.Common;
using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration;
using FavoriteBusApp.Api.Timetables;
using FavoriteBusApp.Api.Timetables.Contracts;
using FavoriteBusApp.Api.Timetables.CtpIntegration;
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

builder.AddRedisClient(connectionName: "redis");

builder.Services.AddScoped<ICache, RedisCache>();

builder.Services.AddScoped<ICtpCsvParser, CtpCsvParser>();
builder.Services.AddScoped<ICtpCsvClient, CtpCsvClient>().AddHttpClient();

builder.Services.Configure<TranzyOptions>(builder.Configuration.GetSection("Tranzy"));
builder.Services.AddScoped<ITranzyClient, TranzyClient>().AddHttpClient();

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
        return result.ToResult();
    }
);

app.MapGet(
    "/api/timetables/{routeName}/refresh",
    async (string routeName, bool forceRefresh, IMediator mediator) =>
    {
        var result = await mediator.Send(
            new GetWeeklyTimetableQuery { RouteName = routeName, ForceRefresh = true }
        );
        return result.ToResult();
    }
);

app.MapGet(
    "/api/vehicles/{routeName}",
    async (string routeName, IMediator mediator) =>
    {
        var result = await mediator.Send(new GetActiveVehiclesQuery { RouteName = routeName });
        return result.ToResult();
    }
);

app.MapGet(
    "/api/routes",
    async (IMediator mediator) =>
    {
        var result = await mediator.Send(new GetRoutesQuery());
        return result.ToResult();
    }
);

app.MapGet(
    "/api/routes/refresh",
    async (IMediator mediator) =>
    {
        var result = await mediator.Send(new GetRoutesQuery { ForceRefresh = true });
        return result.ToResult();
    }
);

app.Run();
