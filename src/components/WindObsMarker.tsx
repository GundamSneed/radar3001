import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { StationObservation } from "../lib/nwsStations";
import "./WindObsMarker.css";

interface WindObsMarkerProps {
  observation: StationObservation;
}

function windIcon(directionDeg: number | null): L.DivIcon {
  // NWS reports the direction wind is blowing FROM; rotate +180 so the arrow points where it's blowing TO.
  const html =
    directionDeg != null
      ? `<div class="wind-obs-marker__arrow" style="transform: rotate(${directionDeg + 180}deg)">&#8593;</div>`
      : `<div class="wind-obs-marker__dot"></div>`;

  return L.divIcon({
    className: "wind-obs-marker",
    html,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

export default function WindObsMarker({ observation }: WindObsMarkerProps) {
  const {
    stationName,
    timestamp,
    textDescription,
    temperatureF,
    windSpeedMph,
    windDirectionDeg,
    windGustMph,
  } = observation;

  return (
    <Marker position={[observation.lat, observation.lon]} icon={windIcon(windDirectionDeg)}>
      <Popup>
        <div className="wind-obs-popup">
          <div className="wind-obs-popup__title">{stationName}</div>
          <div className="wind-obs-popup__meta">{new Date(timestamp).toLocaleString()}</div>
          {textDescription && <div className="wind-obs-popup__row">{textDescription}</div>}
          <div className="wind-obs-popup__row">
            {temperatureF != null ? `${Math.round(temperatureF)}°F` : "Temp n/a"}
          </div>
          <div className="wind-obs-popup__row">
            {windSpeedMph != null
              ? `Wind ${Math.round(windSpeedMph)} mph${
                  windDirectionDeg != null ? ` @ ${Math.round(windDirectionDeg)}°` : ""
                }`
              : "Wind n/a"}
            {windGustMph != null ? ` (gust ${Math.round(windGustMph)} mph)` : ""}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
