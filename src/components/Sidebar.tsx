import type { NwsAlertCollection } from "../lib/nwsAlerts";
import ZoneAlertsList from "./ZoneAlertsList";
import "./Sidebar.css";

const PLANNED_LAYERS = [
  "Velocity",
  "Precip type",
  "Storm tracks",
  "Hail / freezing level",
  "Lightning",
];

interface SidebarProps {
  showReflectivity: boolean;
  showPrecipitation: boolean;
  showSatellite: boolean;
  showAlerts: boolean;
  alertsData: NwsAlertCollection | null;
  onToggleReflectivity: () => void;
  onTogglePrecipitation: () => void;
  onToggleSatellite: () => void;
  onToggleAlerts: () => void;
}

export default function Sidebar({
  showReflectivity,
  showPrecipitation,
  showSatellite,
  showAlerts,
  alertsData,
  onToggleReflectivity,
  onTogglePrecipitation,
  onToggleSatellite,
  onToggleAlerts,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__tabs">
        <button className="sidebar__tab sidebar__tab--active" type="button">
          Layers
        </button>
        <button className="sidebar__tab" type="button">
          Legend
        </button>
        <button className="sidebar__collapse" type="button" aria-label="Collapse sidebar">
          ›
        </button>
      </div>

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
        <li className="layer-list__item layer-list__item--disabled">
          <input type="checkbox" id="layer-wind" disabled />
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

      <div className="sidebar__section">
        <div className="sidebar__section-title">Legend</div>
        <div className="legend-scale">
          <span className="legend-scale__segment legend-scale__segment--light" />
          <span className="legend-scale__segment legend-scale__segment--mid" />
          <span className="legend-scale__segment legend-scale__segment--heavy" />
        </div>
        <div className="legend-scale__labels">
          <span>light</span>
          <span>heavy</span>
        </div>
      </div>
    </aside>
  );
}
