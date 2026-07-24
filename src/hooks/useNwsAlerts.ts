import { useCallback, useEffect, useState } from "react";
import { fetchActiveAlerts, type NwsAlertCollection } from "../lib/nwsAlerts";

interface NwsAlertsState {
  data: NwsAlertCollection | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNwsAlerts(stateCode: string): NwsAlertsState {
  const [state, setState] = useState<Omit<NwsAlertsState, "refetch">>({
    data: null,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchActiveAlerts(stateCode)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState((s) => ({ data: s.data, loading: false, error: err.message }));
      });

    return () => {
      cancelled = true;
    };
  }, [stateCode, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, refetch };
}
