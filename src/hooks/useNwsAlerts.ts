import { useEffect, useState } from "react";
import { fetchActiveAlerts, type NwsAlertCollection } from "../lib/nwsAlerts";

interface NwsAlertsState {
  data: NwsAlertCollection | null;
  loading: boolean;
  error: string | null;
}

export function useNwsAlerts(stateCode: string): NwsAlertsState {
  const [state, setState] = useState<NwsAlertsState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetchActiveAlerts(stateCode)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [stateCode]);

  return state;
}
