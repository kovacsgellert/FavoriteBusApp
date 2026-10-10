using Microsoft.Extensions.Hosting;
using Projects;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddDockerComposeEnvironment("favoritebusapp-env");

if (builder.Environment.IsProduction())
    builder.AddContainerRegistry("ghcr", "ghcr.io", "kovacsgellert/favoritebusapp");

var redis = builder.AddRedis("redis").WithDataVolume("redis-volume", false).WithRedisInsight();

var api = builder
    .AddProject<FavoriteBusApp_Api>("api")
    .WithReference(redis)
    .WaitFor(redis)
    .WithExternalHttpEndpoints()
    .WithRemoteImageTag("0.2.3");

builder
    .AddViteApp("client", "../favoritebusapp-client")
    .WaitFor(api)
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(port: 3000, targetPort: 2999, env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .WithRemoteImageTag("0.2.3");

builder.Build().Run();
