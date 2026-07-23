// NWS API usage policy requires a descriptive User-Agent identifying the app + contact.
const NWS_USER_AGENT = "radar3001-weather-dashboard (matthewgmonaco@gmail.com)";

// Region selection isn't wired up yet (Phase 4) — hardcoded default until then.
export const DEFAULT_ALERTS_STATE = "FL";

export type AlertSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";

export const ALERT_SEVERITY_COLOR: Record<AlertSeverity, string> = {
  Extreme: "var(--alert-extreme)",
  Severe: "var(--alert-severe)",
  Moderate: "var(--alert-moderate)",
  Minor: "var(--alert-minor)",
  Unknown: "var(--alert-unknown)",
};

export interface NwsAlertProperties {
  headline: string | null;
  description: string;
  severity: AlertSeverity;
  event: string;
  areaDesc: string;
  effective: string;
  expires: string;
}

export type NwsAlertFeature = GeoJSON.Feature<GeoJSON.Geometry, NwsAlertProperties>;
export type NwsAlertCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, NwsAlertProperties>;

export async function fetchActiveAlerts(stateCode: string): Promise<NwsAlertCollection> {
  const res = await fetch(`https://api.weather.gov/alerts/active?area=${stateCode}`, {
    headers: {
      "User-Agent": NWS_USER_AGENT,
      Accept: "application/geo+json",
    },
  });

  if (!res.ok) {
    throw new Error(`NWS alerts request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
