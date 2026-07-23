import { GeoJSON } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import { ALERT_SEVERITY_COLOR, type NwsAlertCollection, type NwsAlertFeature } from "../lib/nwsAlerts";
import "./AlertsLayer.css";

function styleForAlert(feature?: NwsAlertFeature): PathOptions {
  const severity = feature?.properties.severity ?? "Unknown";
  const color = ALERT_SEVERITY_COLOR[severity] ?? ALERT_SEVERITY_COLOR.Unknown;
  return {
    color,
    weight: 1.5,
    fillColor: color,
    fillOpacity: 0.2,
  };
}

function popupHtml(feature: NwsAlertFeature): string {
  const { headline, event, severity, areaDesc, description, expires } = feature.properties;
  const expiresLabel = new Date(expires).toLocaleString();
  return `
    <div class="alert-popup">
      <div class="alert-popup__title">${headline ?? event}</div>
      <div class="alert-popup__meta">${severity} &middot; ${areaDesc}</div>
      <div class="alert-popup__body">${description}</div>
      <div class="alert-popup__expires">Expires: ${expiresLabel}</div>
    </div>
  `;
}

function bindAlertPopup(feature: NwsAlertFeature, layer: Layer) {
  layer.bindPopup(popupHtml(feature), { maxWidth: 320, className: "alert-popup-wrapper" });
}

interface AlertsLayerProps {
  data: NwsAlertCollection;
}

export default function AlertsLayer({ data }: AlertsLayerProps) {
  // Many active alerts (advisories/statements/watches) are zone-based and carry no
  // inline polygon — GeoJSON can't render those; ZoneAlertsList surfaces them instead.
  const withGeometry: NwsAlertCollection = {
    ...data,
    features: data.features.filter((f) => f.geometry !== null),
  };

  return (
    <GeoJSON
      key={withGeometry.features.length}
      data={withGeometry}
      style={styleForAlert as (feature?: GeoJSON.Feature) => PathOptions}
      onEachFeature={bindAlertPopup as (feature: GeoJSON.Feature, layer: Layer) => void}
    />
  );
}
