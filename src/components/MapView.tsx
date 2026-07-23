import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRainViewerData } from "../hooks/useRainViewerData";
import { radarTileUrl } from "../lib/rainviewer";
import { GOES_INFRARED_TILE_URL, GOES_INFRARED_MAX_NATIVE_ZOOM } from "../lib/goesSatellite";
import type { NwsAlertCollection } from "../lib/nwsAlerts";
import type { StationObservation } from "../lib/nwsStations";
import AlertsLayer from "./AlertsLayer";
import WindObsMarker from "./WindObsMarker";
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
}

export default function MapView({
  showReflectivity,
  showPrecipitation,
  showSatellite,
  showAlerts,
  alertsData,
  showWind,
  windObs,
}: MapViewProps) {
  const { data } = useRainViewerData();

  const radarFrame = data?.radar.past.at(-1);
  const showRadar = showReflectivity || showPrecipitation;

  return (
    <div className="map-view">
      <MapContainer center={US_CENTER} zoom={5} maxZoom={19}>
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
        {data && showRadar && radarFrame && (
          <TileLayer
            url={radarTileUrl(data.host, radarFrame)}
            opacity={0.75}
            maxZoom={19}
            maxNativeZoom={12}
          />
        )}
        {showAlerts && alertsData && <AlertsLayer data={alertsData} />}
        {showWind && windObs && <WindObsMarker observation={windObs} />}
      </MapContainer>
    </div>
  );
}
