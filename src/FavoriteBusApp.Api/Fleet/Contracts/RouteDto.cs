namespace FavoriteBusApp.Api.Common;

public record RouteDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string LongName { get; init; }
    public required string Type { get; init; }
}
