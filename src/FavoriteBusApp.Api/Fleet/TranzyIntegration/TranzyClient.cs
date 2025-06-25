using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;
using Microsoft.Extensions.Options;

namespace FavoriteBusApp.Api.Fleet.TranzyIntegration;

public interface ITranzyClient
{
    Task<TranzyVehicle[]> GetVehicles();
    Task<TranzyRoute[]> GetRoutes();
    Task<TranzyTrip[]> GetTrips();
}

public class TranzyClient : ITranzyClient
{
    private readonly HttpClient _httpClient;
    private readonly IOptions<TranzyOptions> _options;

    public TranzyClient(HttpClient httpClient, IOptions<TranzyOptions> options)
    {
        _httpClient = httpClient;
        _options = options;
    }

    public async Task<TranzyVehicle[]> GetVehicles()
    {
        var url = $"{TranzyConstants.TranzyBaseUrl}/vehicles";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-API-KEY", _options.Value.ApiKey);
        request.Headers.Add("X-Agency-Id", TranzyConstants.CtpAgencyId);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();

        var vehicles = JsonSerializer.Deserialize<TranzyVehicle[]>(content) ?? [];
        return vehicles;
    }

    public async Task<TranzyRoute[]> GetRoutes()
    {
        var url = $"{TranzyConstants.TranzyBaseUrl}/routes";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-API-KEY", _options.Value.ApiKey);
        request.Headers.Add("X-Agency-Id", TranzyConstants.CtpAgencyId);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();

        var routes = JsonSerializer.Deserialize<TranzyRoute[]>(content) ?? [];
        return routes;
    }

    public async Task<TranzyTrip[]> GetTrips()
    {
        var url = $"{TranzyConstants.TranzyBaseUrl}/trips";
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Add("X-API-KEY", _options.Value.ApiKey);
        request.Headers.Add("X-Agency-Id", TranzyConstants.CtpAgencyId);

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();

        var trips = JsonSerializer.Deserialize<TranzyTrip[]>(content) ?? [];
        return trips;
    }
}
