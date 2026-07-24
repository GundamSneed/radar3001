import { useState } from "react";
import type { NwsAlertCollection } from "../lib/nwsAlerts";
import ZoneAlertsList from "./ZoneAlertsList";
import Legend from "./Legend";
import "./Sidebar.css";

const PLANNED_LAYERS = [
  "Velocity",
  "Precip type",
  "Storm tracks",
  "Hail / freezing level",
  "Lightning",
];

type SidebarTab = "layers" | "legend";

export interface FetchStatus {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

interface SidebarProps {
  showReflectivity: boolean;
  showPrecipitation: boolean;
  showSatellite: boolean;
  showAlerts: boolean;
  alertsData: NwsAlertCollection | null;
  showWind: boolean;
  onToggleReflectivity: () => void;
  onTogglePrecipitation: () => void;
  onToggleSatellite: () => void;
  onToggleAlerts: () => void;
  onToggleWind: () => void;
  radarStatus: FetchStatus;
  alertsStatus: FetchStatus;
  windStatus: FetchStatus;
}

function LayerHint({ status, loadingLabel }: { status: FetchStatus; loadingLabel: string }) {
  if (status.error) {
    return (
      <span className="layer-list__hint layer-list__hint--error">
        {status.error}
        <button type="button" className="layer-list__retry" onClick={status.onRetry}>
          Retry
        </button>
      </span>
    );
  }
  if (status.loading) {
    return <span className="layer-list__hint">{loadingLabel}</span>;
  }
  return null;
}

export default function Sidebar({
  showReflectivity,
  showPrecipitation,
  showSatellite,
  showAlerts,
  alertsData,
  showWind,
  onToggleReflectivity,
  onTogglePrecipitation,
  onToggleSatellite,
  onToggleAlerts,
  onToggleWind,
  radarStatus,
  alertsStatus,
  windStatus,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState<SidebarTab>("layers");

  return (
    <aside className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <button
        className="sidebar__collapse"
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "‹" : "›"}
      </button>

      <div className="sidebar__body">
        <div className="sidebar__tabs">
          <button
            className={`sidebar__tab${tab === "layers" ? " sidebar__tab--active" : ""}`}
            type="button"
            onClick={() => setTab("layers")}
          >
            Layers
          </button>
          <button
            className={`sidebar__tab${tab === "legend" ? " sidebar__tab--active" : ""}`}
            type="button"
            onClick={() => setTab("legend")}
          >
            Legend
          </button>
        </div>

        {tab === "layers" ? (
          <>
            <ul className="layer-list">
              <li className="layer-list__item">
                <input
                  type="checkbox"
                  id="layer-reflectivity"
                  checked={showReflectivity}
                  onChange={onToggleReflectivity}
                />
                <label htmlFor="layer-reflectivity">Reflectivity</label>
              </li>
              <li className="layer-list__item">
                <input
                  type="checkbox"
                  id="layer-precipitation"
                  checked={showPrecipitation}
                  onChange={onTogglePrecipitation}
                />
                <div className="layer-list__item-text">
                  <label htmlFor="layer-precipitation">Precipitation</label>
                  <LayerHint status={radarStatus} loadingLabel="Loading radar…" />
                </div>
              </li>
              <li className="layer-list__item">
                <input
                  type="checkbox"
                  id="layer-satellite"
                  checked={showSatellite}
                  onChange={onToggleSatellite}
                />
                <div className="layer-list__item-text">
                  <label htmlFor="layer-satellite">Cloud cover (satellite)</label>
                  <span className="layer-list__hint">North America only</span>
                </div>
              </li>
              <li className="layer-list__item">
                <input
                  type="checkbox"
                  id="layer-alerts"
                  checked={showAlerts}
                  onChange={onToggleAlerts}
                />
                <label htmlFor="layer-alerts">Watches / warnings</label>
              </li>
              <li className="layer-list__item">
                <input type="checkbox" id="layer-wind" checked={showWind} onChange={onToggleWind} />
                <div className="layer-list__item-text">
                  <label htmlFor="layer-wind">Wind / surface obs</label>
                  <LayerHint status={windStatus} loadingLabel="Loading station…" />
                </div>
              </li>
            </ul>

            {showAlerts && (
              <div className="sidebar__section">
                <div className="sidebar__section-title">Active alerts (no map shape)</div>
                {alertsStatus.error ? (
                  <div className="zone-alerts__empty zone-alerts__empty--error">
                    {alertsStatus.error}
                    <button type="button" className="layer-list__retry" onClick={alertsStatus.onRetry}>
                      Retry
                    </button>
                  </div>
                ) : alertsStatus.loading ? (
                  <div className="zone-alerts__empty">Loading alerts…</div>
                ) : (
                  <ZoneAlertsList data={alertsData} />
                )}
              </div>
            )}

            <div className="sidebar__section sidebar__section--planned">
              <div className="sidebar__section-title">Planned — later phase</div>
              <ul className="planned-list">
                {PLANNED_LAYERS.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <Legend
            showRadar={showReflectivity || showPrecipitation}
            showSatellite={showSatellite}
            showAlerts={showAlerts}
          />
        )}
      </div>
    </aside>
  );
}
