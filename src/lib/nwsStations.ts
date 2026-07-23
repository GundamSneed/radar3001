// NWS API usage policy requires a descriptive User-Agent identifying the app + contact.
const NWS_USER_AGENT = "radar3001-weather-dashboard (matthewgmonaco@gmail.com)";

export interface StationObservation {
  stationId: string;
  stationName: string;
  lat: number;
  lon: number;
  timestamp: string;
  textDescription: string | null;
  temperatureF: number | null;
  windSpeedMph: number | null;
  windDirectionDeg: number | null;
  windGustMph: number | null;
}

interface NwsPointsResponse {
  properties: {
    observationStations: string;
  };
}

interface NwsStationFeature {
  properties: { stationIdentifier: string; name: string };
  geometry: { type: "Point"; coordinates: [number, number] };
}

interface NwsStationsResponse {
  features: NwsStationFeature[];
}

interface NwsQuantity {
  value: number | null;
}

interface NwsObservationResponse {
  properties: {
    timestamp: string;
    textDescription: string | null;
    temperature: NwsQuantity;
    windSpeed: NwsQuantity;
    windDirection: NwsQuantity;
    windGust: NwsQuantity;
  };
}

async function nwsFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "User-Agent": NWS_USER_AGENT, Accept: "application/geo+json" },
  });
  if (!res.ok) {
    throw new Error(`NWS request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

const celsiusToFahrenheit = (c: number) => (c * 9) / 5 + 32;
const kmhToMph = (kmh: number) => kmh * 0.621371;

export async function fetchNearestStationObservation(
  lat: number,
  lon: number,
): Promise<StationObservation> {
  const point = await nwsFetch<NwsPointsResponse>(`https://api.weather.gov/points/${lat},${lon}`);
  const stations = await nwsFetch<NwsStationsResponse>(point.properties.observationStations);
  const nearest = stations.features[0];
  if (!nearest) {
    throw new Error("No observation stations found near this location");
  }

  const obs = await nwsFetch<NwsObservationResponse>(
    `https://api.weather.gov/stations/${nearest.properties.stationIdentifier}/observations/latest`,
  );
  const { temperature, windSpeed, windDirection, windGust, textDescription, timestamp } = obs.properties;
  const [lonCoord, latCoord] = nearest.geometry.coordinates;

  return {
    stationId: nearest.properties.stationIdentifier,
    stationName: nearest.properties.name,
    lat: latCoord,
    lon: lonCoord,
    timestamp,
    textDescription,
    temperatureF: temperature.value != null ? celsiusToFahrenheit(temperature.value) : null,
    windSpeedMph: windSpeed.value != null ? kmhToMph(windSpeed.value) : null,
    windDirectionDeg: windDirection.value,
    windGustMph: windGust.value != null ? kmhToMph(windGust.value) : null,
  };
}
