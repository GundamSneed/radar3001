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
