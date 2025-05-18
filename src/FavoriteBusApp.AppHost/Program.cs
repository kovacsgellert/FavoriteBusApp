using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<FavoriteBusApp_Api>("api").WithExternalHttpEndpoints();

builder
    .AddNpmApp("reactvite", "../favoritebusapp-client-reactvite")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(port: 3001, targetPort: 3000, env: "VITE_PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// var client = builder
//     .AddNpmApp("client", "../favoritebusapp-client", "dev")
//     .WithNpmPackageInstallation()
//     .WaitFor(api)
//     .WithReference(api)
//     .WithHttpEndpoint(port: 3001, targetPort: 3000, env: "PORT")
//     .WithExternalHttpEndpoints();

builder.Build().Run();
