using System.Text.Json;
using FavoriteBusApp.Api.Locations.Models;
using Microsoft.Extensions.Options;

namespace FavoriteBusApp.Api.Locations;

public class TranzyClient
{
    private readonly HttpClient _httpClient;
    private readonly IOptions<TranzyOptions> _options;

    public TranzyClient(HttpClient httpClient, IOptions<TranzyOptions> options)
    {
        _httpClient = httpClient;
        _options = options;
    }

    public async Task<TranzyVehicle[]> GetVehicles(int routeId, int noOlderThanMinutes = 5)
    {
        var url = $"{TranzyConstants.TranzyBaseUrl}/vehicles";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-API-KEY", _options.Value.ApiKey);
        request.Headers.Add("X-Agency-Id", TranzyConstants.CtpAgencyId);

        var response = await _httpClient.SendAsync(request);

        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();

        var vehicles = JsonSerializer.Deserialize<TranzyVehicle[]>(content) ?? [];

        return
        [
            .. vehicles.Where(v =>
                v.RouteId == routeId
                && v.Timestamp > DateTime.UtcNow.AddMinutes(-noOlderThanMinutes)
            ),
        ];
    }
}
