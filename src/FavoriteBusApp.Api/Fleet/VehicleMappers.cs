using FavoriteBusApp.Api.Fleet.Contracts;
using FavoriteBusApp.Api.Fleet.TranzyIntegration.Models;

namespace FavoriteBusApp.Api.Fleet;

public static class VehicleMappers
{
    public static ActiveVehicleDto ToActiveVehicleDto(
        this TranzyVehicle vehicle,
        string routeName,
        TranzyTrip[] routeTrips
    )
    {
        var fromStop =
            routeTrips.FirstOrDefault(t => t.TripId != vehicle.TripId)?.TripHeadsign ?? "-";
        var toStop =
            routeTrips.FirstOrDefault(t => t.TripId == vehicle.TripId)?.TripHeadsign ?? "-";

        return new ActiveVehicleDto
        {
            Label = vehicle.Label,
            RouteName = routeName,
            Latitude = vehicle.Latitude,
            Longitude = vehicle.Longitude,
            Timestamp = vehicle.Timestamp,
            Speed = vehicle.Speed,
            TripId = vehicle.TripId!,
            FromStop = fromStop,
            ToStop = toStop,
            VehicleType = vehicle.VehicleType,
            BikeAccessible = vehicle.BikeAccessible,
            WheelchairAccessible = vehicle.WheelchairAccessible,
        };
    }
}
