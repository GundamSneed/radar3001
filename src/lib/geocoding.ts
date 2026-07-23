import { getStateCodeByName } from "./usStates";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
// Nominatim's usage policy accepts an `email` param in lieu of a custom User-Agent header —
// browsers silently drop/override any User-Agent header set via fetch, so this plus the
// browser's own Referer is what actually identifies the app to their server.
const CONTACT_EMAIL = "matthewgmonaco@gmail.com";

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
  stateCode: string | null;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  address?: { state?: string };
}

export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    countrycodes: "us",
    addressdetails: "1",
    limit: "1",
    email: CONTACT_EMAIL,
  });

  const res = await fetch(`${NOMINATIM_URL}?${params}`);
  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status} ${res.statusText}`);
  }

  const results: NominatimResult[] = await res.json();
  const first = results[0];
  if (!first) return null;

  return {
    lat: parseFloat(first.lat),
    lon: parseFloat(first.lon),
    displayName: first.display_name,
    stateCode: first.address?.state ? getStateCodeByName(first.address.state) : null,
  };
}
