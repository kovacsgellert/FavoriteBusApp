import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { ActiveVehicleDto } from "../models/ActiveVehicleDto";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import MarkerClusterGroup from "react-leaflet-markercluster";

const orangeBusIcon = new L.Icon({
  iconUrl: "/bus-orange.png",
  iconSize: [28, 28],
});

const greyBusIcon = new L.Icon({
  iconUrl: "/bus-grey.png",
  iconSize: [28, 28],
});

const purpleBusIcon = new L.Icon({
  iconUrl: "/bus-purple.png",
  iconSize: [28, 28],
});

const greenUserIcon = new L.Icon({
  iconUrl: "/user-green.png",
  iconSize: [28, 28],
});

const clujCenter = { latitude: 46.7694, longitude: 23.5909 };

interface MapProps {
  vehicles: ActiveVehicleDto[];
  stops: string[];
  userPosition: { latitude: number; longitude: number };
}

function JumpToUserPositionButton({
  userPosition,
}: {
  userPosition: { latitude: number; longitude: number };
}) {
  const map = useMap();
  return (
    <button
      className="absolute top-4 right-4 z-[1000] bg-green-700 text-white px-3 py-2 rounded-lg shadow hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
      onClick={() => {
        map.setView(
          [userPosition.latitude, userPosition.longitude],
          map.getZoom()
        );
      }}
      title="Center map to your location"
      style={{ pointerEvents: "auto" }}
    >
      Jump to me
    </button>
  );
}

export default function Map({ vehicles, userPosition }: MapProps) {
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
      <div className="h-full w-full rounded-2xl bg-gray-800/60 shadow-lg"></div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-2xl bg-white/10 shadow-lg backdrop-blur-md overflow-hidden">
      <MapContainer
        center={[userPosition.latitude, userPosition.longitude]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userPosition.latitude != clujCenter.latitude &&
          userPosition.longitude != clujCenter.longitude && (
            <Marker
              position={[userPosition.latitude, userPosition.longitude]}
              icon={greenUserIcon}
            >
              <Popup>This is you. (Incredible!)</Popup>
            </Marker>
          )}
        <JumpToUserPositionButton userPosition={userPosition} />
        <MarkerClusterGroup maxClusterRadius={20}>
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
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
