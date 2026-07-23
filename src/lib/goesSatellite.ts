const GOES_EAST_BASE =
  "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/GOES-East_ABI_Band13_Clean_Infrared/default/default/GoogleMapsCompatible_Level6";

// GIBS WMTS REST tiles are ordered {TileMatrix}/{TileRow}/{TileCol} = z/y/x — not the usual XYZ z/x/y.
// "default" in place of a timestamp resolves to the latest available frame server-side (updates ~every 10min).
export const GOES_INFRARED_TILE_URL = `${GOES_EAST_BASE}/{z}/{y}/{x}.png`;

// The GoogleMapsCompatible_Level6 tile matrix set only has native tiles through zoom 6.
export const GOES_INFRARED_MAX_NATIVE_ZOOM = 6;
