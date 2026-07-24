import { useCallback, useEffect, useState } from "react";
import { fetchNearestStationObservation, type StationObservation } from "../lib/nwsStations";

interface StationObservationState {
  data: StationObservation | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStationObservation(lat: number, lon: number): StationObservationState {
  const [state, setState] = useState<Omit<StationObservationState, "refetch">>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchNearestStationObservation(lat, lon)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState((s) => ({ data: s.data, loading: false, error: err.message }));
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, refetch };
}
