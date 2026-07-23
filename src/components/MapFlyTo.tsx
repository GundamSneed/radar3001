import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapFlyToProps {
  lat: number;
  lon: number;
  zoom: number;
}

export default function MapFlyTo({ lat, lon, zoom }: MapFlyToProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lon], zoom, { duration: 1 });
  }, [map, lat, lon, zoom]);

  return null;
}
