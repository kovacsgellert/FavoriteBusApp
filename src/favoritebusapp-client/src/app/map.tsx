"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { TranzyVehicle } from "./models";

const greenBusIcon = new L.Icon({
  iconUrl: "/bus-green.png",
  iconSize: [24, 24],
});

const orangeBusIcon = new L.Icon({
  iconUrl: "/bus-orange.png",
  iconSize: [24, 24],
});

const purpleBusIcon = new L.Icon({
  iconUrl: "/bus-purple.png",
  iconSize: [24, 24],
});
interface MapProps {
  vehicles: TranzyVehicle[];
  loading: boolean;
}

export default function Map({ vehicles, loading }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    return <div className="h-full w-full animate-pulse bg-gray-800"></div>;
  }

  const getIcon = (vehicle: TranzyVehicle) => {
    switch (vehicle.trip_id) {
      case "14_0": // going to Snagov Nord
        return purpleBusIcon;
      case "14_1": // going to Disp. Calbucet
        return orangeBusIcon;
      default:
        return greenBusIcon;
    }
  };

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
      {!loading &&
        vehicles &&
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
