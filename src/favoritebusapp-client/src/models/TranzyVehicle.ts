export type TranzyVehicle = {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
  route_id: number;
  trip_id: string;
  vehicle_type: number;
  bike_accessible: string;
  wheelchair_accessible: string;
};
