namespace FavoriteBusApp.Api.Fleet.TranzyIntegration;

using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

public interface ITranzyClient
{
    Task<TranzyVehicle[]> GetVehicles();
    Task<TranzyRoute[]> GetRoutes();
    Task<TranzyTrip[]> GetTrips();
}
