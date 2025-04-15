"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png",
  iconSize: [32, 32],
});

export default function MapComponent() {
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
      <Marker position={[46.7694, 23.5909]} icon={busIcon}>
        <Popup>Piața Unirii, Cluj-Napoca</Popup>
      </Marker>
    </MapContainer>
  );
}
