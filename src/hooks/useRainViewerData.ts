import { useEffect, useState } from "react";
import { fetchWeatherMaps, type RainViewerData } from "../lib/rainviewer";

interface RainViewerState {
  data: RainViewerData | null;
  loading: boolean;
  error: string | null;
}

export function useRainViewerData(): RainViewerState {
  const [state, setState] = useState<RainViewerState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchWeatherMaps()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
