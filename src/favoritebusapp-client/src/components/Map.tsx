import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { TranzyVehicle } from "../models/TranzyVehicle";

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
  vehicles: TranzyVehicle[];
  stops: string[];
}

interface VehicleMapProps {
  icon: L.Icon;
  from: string;
  to: string;
}

export default function Map({ vehicles, stops }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const getVehicleMapProps = (vehicle: TranzyVehicle) => {
    if (!vehicle.trip_id)
      return { icon: greyBusIcon, from: "-", to: "-" } as VehicleMapProps;

    if (vehicle.trip_id.endsWith("0")) {
      return {
        icon: orangeBusIcon,
        from: stops[0],
        to: stops[1],
      } as VehicleMapProps;
    } else if (vehicle.trip_id.endsWith("1")) {
      return {
        icon: purpleBusIcon,
        from: stops[1],
        to: stops[0],
      } as VehicleMapProps;
    } else {
      return { icon: greyBusIcon, from: "-", to: "-" } as VehicleMapProps;
    }
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
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={getVehicleMapProps(vehicle).icon}
            >
              <Popup>
                From: {getVehicleMapProps(vehicle).from} <br />
                To: {getVehicleMapProps(vehicle).to} <br />
                Speed: {vehicle.speed} km/h <br />
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
