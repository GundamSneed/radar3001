export interface UsStateInfo {
  code: string;
  name: string;
  lat: number;
  lon: number;
}

// Approximate geographic centers — good enough for recentering the map, not for precision geo work.
export const US_STATES: UsStateInfo[] = [
  { code: "AL", name: "Alabama", lat: 32.7794, lon: -86.8287 },
  { code: "AK", name: "Alaska", lat: 64.0685, lon: -152.2782 },
  { code: "AZ", name: "Arizona", lat: 34.2744, lon: -111.6602 },
  { code: "AR", name: "Arkansas", lat: 34.8938, lon: -92.4426 },
  { code: "CA", name: "California", lat: 37.1841, lon: -119.4696 },
  { code: "CO", name: "Colorado", lat: 38.9972, lon: -105.5478 },
  { code: "CT", name: "Connecticut", lat: 41.6219, lon: -72.7273 },
  { code: "DE", name: "Delaware", lat: 38.9896, lon: -75.505 },
  { code: "DC", name: "District of Columbia", lat: 38.9101, lon: -77.0147 },
  { code: "FL", name: "Florida", lat: 28.6305, lon: -82.4497 },
  { code: "GA", name: "Georgia", lat: 32.6415, lon: -83.4426 },
  { code: "HI", name: "Hawaii", lat: 20.2927, lon: -156.3737 },
  { code: "ID", name: "Idaho", lat: 44.3509, lon: -114.613 },
  { code: "IL", name: "Illinois", lat: 40.0417, lon: -89.1965 },
  { code: "IN", name: "Indiana", lat: 39.8942, lon: -86.2816 },
  { code: "IA", name: "Iowa", lat: 42.0751, lon: -93.496 },
  { code: "KS", name: "Kansas", lat: 38.4937, lon: -98.3804 },
  { code: "KY", name: "Kentucky", lat: 37.5347, lon: -85.3021 },
  { code: "LA", name: "Louisiana", lat: 31.0689, lon: -91.9968 },
  { code: "ME", name: "Maine", lat: 45.3695, lon: -69.2428 },
  { code: "MD", name: "Maryland", lat: 39.055, lon: -76.7909 },
  { code: "MA", name: "Massachusetts", lat: 42.2596, lon: -71.8083 },
  { code: "MI", name: "Michigan", lat: 44.3467, lon: -85.4102 },
  { code: "MN", name: "Minnesota", lat: 46.2807, lon: -94.3053 },
  { code: "MS", name: "Mississippi", lat: 32.7364, lon: -89.6678 },
  { code: "MO", name: "Missouri", lat: 38.3566, lon: -92.458 },
  { code: "MT", name: "Montana", lat: 47.0527, lon: -109.6333 },
  { code: "NE", name: "Nebraska", lat: 41.5378, lon: -99.7951 },
  { code: "NV", name: "Nevada", lat: 39.3289, lon: -116.6312 },
  { code: "NH", name: "New Hampshire", lat: 43.6805, lon: -71.5811 },
  { code: "NJ", name: "New Jersey", lat: 40.1907, lon: -74.6728 },
  { code: "NM", name: "New Mexico", lat: 34.4071, lon: -106.1126 },
  { code: "NY", name: "New York", lat: 42.9538, lon: -75.5268 },
  { code: "NC", name: "North Carolina", lat: 35.5557, lon: -79.3877 },
  { code: "ND", name: "North Dakota", lat: 47.4501, lon: -100.4659 },
  { code: "OH", name: "Ohio", lat: 40.2862, lon: -82.7937 },
  { code: "OK", name: "Oklahoma", lat: 35.5889, lon: -97.4943 },
  { code: "OR", name: "Oregon", lat: 43.9336, lon: -120.5583 },
  { code: "PA", name: "Pennsylvania", lat: 40.8781, lon: -77.7996 },
  { code: "RI", name: "Rhode Island", lat: 41.6762, lon: -71.5562 },
  { code: "SC", name: "South Carolina", lat: 33.8191, lon: -80.9066 },
  { code: "SD", name: "South Dakota", lat: 44.4443, lon: -100.2263 },
  { code: "TN", name: "Tennessee", lat: 35.858, lon: -86.3505 },
  { code: "TX", name: "Texas", lat: 31.4757, lon: -99.3312 },
  { code: "UT", name: "Utah", lat: 39.3055, lon: -111.6703 },
  { code: "VT", name: "Vermont", lat: 44.0687, lon: -72.6658 },
  { code: "VA", name: "Virginia", lat: 37.5215, lon: -78.8537 },
  { code: "WA", name: "Washington", lat: 47.3826, lon: -120.4472 },
  { code: "WV", name: "West Virginia", lat: 38.6409, lon: -80.6227 },
  { code: "WI", name: "Wisconsin", lat: 44.6243, lon: -89.9941 },
  { code: "WY", name: "Wyoming", lat: 42.9957, lon: -107.5512 },
];

export function getStateByCode(code: string): UsStateInfo | undefined {
  return US_STATES.find((s) => s.code === code);
}

export function getStateCodeByName(name: string): string | null {
  const match = US_STATES.find((s) => s.name.toLowerCase() === name.toLowerCase());
  return match ? match.code : null;
}
