using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<FavoriteBusApp_Api>("api").WithExternalHttpEndpoints();

var client = builder
    .AddNpmApp("client", "../favoritebusapp-client", "dev")
    .WithNpmPackageInstallation()
    .WaitFor(api)
    .WithReference(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
