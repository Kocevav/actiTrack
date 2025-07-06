"use client";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import React from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function ActivityMap({
  positionsList,
}: {
  positionsList: { lat: number; lng: number }[][];
}) {
  if (!positionsList || positionsList.length === 0)
    return (
      <div className="w-full bg-neutral-900/80 rounded-2xl border border-orange-400/10 p-6 text-center text-orange-300 shadow-lg mt-6">
        No route data for this activity.
      </div>
    );

  // Center map on the first point of the first polyline
  const center =
    positionsList[0] && positionsList[0][0]
      ? positionsList[0][0]
      : { lat: 0, lng: 0 };

  return (
    <div className="w-full max-w-2xl mx-auto bg-neutral-900/80 rounded-2xl border border-orange-400/10 p-4 shadow-lg mt-6">
      <h3 className="text-lg font-bold text-orange-200 mb-4 text-center">
        Activity Route Map
      </h3>
      <div className="rounded-2xl overflow-hidden" style={{ height: 300 }}>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          className="rounded-2xl"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> | <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {positionsList.map((positions, idx) => {
            const startPos = positions[0];
            const endPos = positions[positions.length - 1];
            return (
              <React.Fragment key={`polyline-${idx}`}>
                <Polyline positions={positions} color="#fb923c" weight={5} />
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
