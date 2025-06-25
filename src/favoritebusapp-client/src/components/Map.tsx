import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { TranzyVehicle } from "../models/TranzyVehicle";
import { ActiveVehicleDto } from "../models/ActiveVehicleDto";

const orangeBusIcon = new L.Icon({
  iconUrl: "/bus-orange.png",
  iconSize: [28, 28],
  popupAnchor: [0, -28],
});

const greyBusIcon = new L.Icon({
  iconUrl: "/bus-grey.png",
  iconSize: [28, 28],
  popupAnchor: [0, -28],
});

const purpleBusIcon = new L.Icon({
  iconUrl: "/bus-purple.png",
  iconSize: [28, 28],
  popupAnchor: [0, -28],
});

interface MapProps {
  vehicles: ActiveVehicleDto[];
  stops: string[];
}

export default function Map({ vehicles, stops }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const getVehicleIcon = (vehicle: ActiveVehicleDto) => {
    if (!vehicle.tripId) return greyBusIcon;
    if (vehicle.tripId.endsWith("0")) return orangeBusIcon;
    return purpleBusIcon;
  };

  if (!isMounted) {
    return (
      <div className="h-full w-full animate-pulse rounded-2xl bg-gray-800/60 shadow-lg"></div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl bg-white/10 shadow-lg backdrop-blur-md overflow-hidden">
      <MapContainer
        center={[46.7694, 23.5909]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles &&
          vehicles.map((vehicle) => (
            <Marker
              key={vehicle.label}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={getVehicleIcon(vehicle)}
            >
              <Popup>
                From: {vehicle.fromStop} <br />
                To: {vehicle.toStop} <br />
                Speed: {vehicle.speed} km/h <br />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
