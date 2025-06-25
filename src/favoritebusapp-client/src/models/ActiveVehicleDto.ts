export type ActiveVehicleDto = {
  label: string;
  routeName: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
  tripId: string;
  fromStop: string;
  toStop: string;
  vehicleType: number;
  bikeAccessible: string;
  wheelchairAccessible: string;
};
