"use client";

import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { TranzyVehicle } from "./models";

const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png",
  iconSize: [32, 32],
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

  if (!isMounted || loading) {
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
      {!loading &&
        vehicles &&
        vehicles.map((vehicle) => (
          <Marker
            key={vehicle.id}
            position={[vehicle.latitude, vehicle.longitude]}
            icon={busIcon}
          >
            <Popup>
              Label: {vehicle.label} <br />
              Speed: {vehicle.speed} km/h
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
