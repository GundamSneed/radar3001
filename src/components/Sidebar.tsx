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
                <label htmlFor="layer-precipitation">Precipitation</label>
              </li>
              <li className="layer-list__item">
                <input
                  type="checkbox"
                  id="layer-satellite"
                  checked={showSatellite}
                  onChange={onToggleSatellite}
                />
                <label htmlFor="layer-satellite">Cloud cover (satellite)</label>
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
                <label htmlFor="layer-wind">Wind / surface obs</label>
              </li>
            </ul>

            {showAlerts && (
              <div className="sidebar__section">
                <div className="sidebar__section-title">Active alerts (no map shape)</div>
                <ZoneAlertsList data={alertsData} />
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
