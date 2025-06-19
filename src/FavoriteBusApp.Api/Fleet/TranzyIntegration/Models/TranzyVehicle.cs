using System.Text.Json.Serialization;

namespace FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

public class TranzyVehicle
{
    [JsonPropertyName("id")]
    public required int Id { get; set; }

    [JsonPropertyName("label")]
    public required string Label { get; set; }

    [JsonPropertyName("latitude")]
    public decimal? Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public decimal? Longitude { get; set; }

    [JsonPropertyName("timestamp")]
    public required DateTime Timestamp { get; set; }

    [JsonPropertyName("speed")]
    public int? Speed { get; set; }

    [JsonPropertyName("route_id")]
    public int? RouteId { get; set; }

    [JsonPropertyName("trip_id")]
    public string? TripId { get; set; }

    [JsonPropertyName("vehicle_type")]
    public required int VehicleType { get; set; }

    [JsonPropertyName("bike_accessible")]
    public required string BikeAccessible { get; set; }

    [JsonPropertyName("wheelchair_accessible")]
    public required string WheelchairAccessible { get; set; }
}
