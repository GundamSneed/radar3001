import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { radarTileUrl, RADAR_MAX_NATIVE_ZOOM } from "../lib/rainviewer";
import { GOES_INFRARED_TILE_URL, GOES_INFRARED_MAX_NATIVE_ZOOM } from "../lib/goesSatellite";
import type { NwsAlertCollection } from "../lib/nwsAlerts";
import type { StationObservation } from "../lib/nwsStations";
import type { TimelineFrame } from "../hooks/useTimelinePlayback";
import AlertsLayer from "./AlertsLayer";
import WindObsMarker from "./WindObsMarker";
import MapFlyTo from "./MapFlyTo";
import "./MapView.css";

const US_CENTER: [number, number] = [39.8, -98.5];

interface MapViewProps {
  showReflectivity: boolean;
  showPrecipitation: boolean;
  showSatellite: boolean;
  showAlerts: boolean;
  alertsData: NwsAlertCollection | null;
  showWind: boolean;
  windObs: StationObservation | null;
  radarHost: string | null;
  radarFrame: TimelineFrame | null;
  flyTo: { lat: number; lon: number; zoom: number };
}

export default function MapView({
  showReflectivity,
  showPrecipitation,
  showSatellite,
  showAlerts,
  alertsData,
  showWind,
  windObs,
  radarHost,
  radarFrame,
  flyTo,
}: MapViewProps) {
  const showRadar = showReflectivity || showPrecipitation;

  return (
    <div className="map-view">
      <MapContainer center={US_CENTER} zoom={5} maxZoom={19}>
        <MapFlyTo lat={flyTo.lat} lon={flyTo.lon} zoom={flyTo.zoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        {showSatellite && (
          <TileLayer
            url={GOES_INFRARED_TILE_URL}
            opacity={0.6}
            maxZoom={19}
            maxNativeZoom={GOES_INFRARED_MAX_NATIVE_ZOOM}
          />
        )}
        {radarHost && showRadar && radarFrame && (
          <TileLayer
            url={radarTileUrl(radarHost, radarFrame)}
            opacity={radarFrame.isNowcast ? 0.55 : 0.75}
            maxZoom={19}
            maxNativeZoom={RADAR_MAX_NATIVE_ZOOM}
          />
        )}
        {showAlerts && alertsData && <AlertsLayer data={alertsData} />}
        {showWind && windObs && <WindObsMarker observation={windObs} />}
      </MapContainer>
    </div>
  );
}
