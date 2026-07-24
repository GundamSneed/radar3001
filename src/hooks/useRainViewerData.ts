import { useCallback, useEffect, useState } from "react";
import { fetchWeatherMaps, type RainViewerData } from "../lib/rainviewer";

interface RainViewerState {
  data: RainViewerData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRainViewerData(): RainViewerState {
  const [state, setState] = useState<Omit<RainViewerState, "refetch">>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWeatherMaps()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState((s) => ({ data: s.data, loading: false, error: err.message }));
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, refetch };
}
