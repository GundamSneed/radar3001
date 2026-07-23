export interface RainViewerFrame {
  time: number;
  path: string;
}

export interface RainViewerData {
  host: string;
  radar: {
    past: RainViewerFrame[];
    nowcast: RainViewerFrame[];
  };
}

const WEATHER_MAPS_URL = "https://api.rainviewer.com/public/weather-maps.json";

export async function fetchWeatherMaps(): Promise<RainViewerData> {
  const response = await fetch(WEATHER_MAPS_URL);
  if (!response.ok) {
    throw new Error(`RainViewer request failed: ${response.status}`);
  }
  return response.json();
}

// Color scheme 1 = "Original" (green/yellow/red), matching the sidebar legend swatches.
export function radarTileUrl(host: string, frame: RainViewerFrame): string {
  return `${host}${frame.path}/256/{z}/{x}/{y}/1/1_1.png`;
}

// Verified empirically: RainViewer serves real tiles through z7 and a fixed
// "Zoom Level Not Supported" placeholder image for any request beyond that,
// regardless of tile size. Leaflet upscales past this for closer zooms.
export const RADAR_MAX_NATIVE_ZOOM = 7;
