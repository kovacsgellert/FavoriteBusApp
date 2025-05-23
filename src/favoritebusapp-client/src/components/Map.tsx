import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { TranzyVehicle } from "../models/TranzyVehicle";

const orangeBusIcon = new L.Icon({
  iconUrl: "/bus-orange.png",
  iconSize: [24, 24],
});
const leftBusIcon = new L.Icon({
  iconUrl: "/bus-left-64.png",
  iconSize: [48, 48],
});

const rightBusIcon = new L.Icon({
  iconUrl: "/bus-right-64.png",
  iconSize: [48, 48],
});

interface MapProps {
  vehicles: TranzyVehicle[];
}

export default function Map({ vehicles }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const getIcon = (vehicle: TranzyVehicle) => {
    switch (vehicle.trip_id) {
      case "14_0": // going to Snagov Nord
        return rightBusIcon;
      case "14_1": // going to Disp. Calbucet
        return leftBusIcon;
      default:
        return orangeBusIcon;
    }
  };

  if (!isMounted) {
    return <div className="h-full w-full animate-pulse bg-gray-800"></div>;
  }

  return (
    <MapContainer
      center={[46.7694, 23.5909]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {vehicles &&
        vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.latitude, vehicle.longitude]}
            icon={getIcon(vehicle)}
          >
            <Popup>
              Label: {vehicle.label} <br />
              Speed: {vehicle.speed} km/h <br />
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
