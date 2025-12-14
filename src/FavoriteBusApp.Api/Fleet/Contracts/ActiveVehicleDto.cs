namespace FavoriteBusApp.Api.Fleet.Contracts;

public record ActiveVehicleDto
{
    public required string Label { get; init; }
    public required string RouteName { get; init; }
    public decimal? Latitude { get; init; }
    public decimal? Longitude { get; init; }
    public DateTime Timestamp { get; init; }
    public int? Speed { get; init; }
    public required string TripId { get; init; }
    public required string FromStop { get; init; }
    public required string ToStop { get; init; }
    public required int VehicleType { get; init; }
    public required string BikeAccessible { get; init; }
    public required string WheelchairAccessible { get; init; }
}
