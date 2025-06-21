using System.Text.Json.Serialization;

namespace FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

public class TranzyRoute
{
    [JsonPropertyName("route_id")]
    public required int RouteId { get; set; }

    [JsonPropertyName("route_short_name")]
    public required string RouteShortName { get; set; }

    [JsonPropertyName("route_long_name")]
    public required string RouteLongName { get; set; }

    [JsonPropertyName("route_type")]
    public required int RouteType { get; set; }

    [JsonPropertyName("route_color")]
    public required string RouteColor { get; set; }

    [JsonPropertyName("route_desc")]
    public required string RouteDescription { get; set; }
}
