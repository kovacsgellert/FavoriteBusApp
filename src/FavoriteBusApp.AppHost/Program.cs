using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<FavoriteBusApp_Api>("api").WithExternalHttpEndpoints();

builder
    .AddNpmApp("client", "../favoritebusapp-client", "dev")
    .WithNpmPackageInstallation()
    .WaitFor(api)
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(port: 3000, targetPort: 2999, env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
