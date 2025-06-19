using System.Text.Json.Serialization;

namespace FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

public class TranzyTrip
{
    [JsonPropertyName("route_id")]
    public required int RouteId { get; set; }

    [JsonPropertyName("trip_id")]
    public required string TripId { get; set; }

    [JsonPropertyName("trip_headsign")]
    public required string TripHeadsign { get; set; }

    [JsonPropertyName("direction_id")]
    public required int DirectionId { get; set; }

    [JsonPropertyName("block_id")]
    public required int BlockId { get; set; }

    [JsonPropertyName("shape_id")]
    public required string ShapeId { get; set; }
}
