import { useEffect, useState } from "react";
import { fetchNearestStationObservation, type StationObservation } from "../lib/nwsStations";

interface StationObservationState {
  data: StationObservation | null;
  loading: boolean;
  error: string | null;
}

export function useStationObservation(lat: number, lon: number): StationObservationState {
  const [state, setState] = useState<StationObservationState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchNearestStationObservation(lat, lon)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return state;
}
