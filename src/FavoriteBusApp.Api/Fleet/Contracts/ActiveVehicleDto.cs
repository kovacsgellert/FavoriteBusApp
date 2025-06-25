namespace FavoriteBusApp.Api.Fleet.Contracts;

public class ActiveVehicleDto
{
    public required string Label { get; set; }
    public required string RouteName { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
    public DateTime Timestamp { get; set; }
    public int? Speed { get; set; }
    public required string TripId { get; set; }
    public required string FromStop { get; set; }
    public required string ToStop { get; set; }
    public required int VehicleType { get; set; }
    public required string BikeAccessible { get; set; }
    public required string WheelchairAccessible { get; set; }
}
