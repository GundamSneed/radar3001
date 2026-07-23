import { ALERT_SEVERITY_COLOR, type AlertSeverity } from "../lib/nwsAlerts";
import "./Legend.css";

const ALERT_SEVERITIES: AlertSeverity[] = ["Extreme", "Severe", "Moderate", "Minor"];

interface LegendProps {
  showRadar: boolean;
  showSatellite: boolean;
  showAlerts: boolean;
}

export default function Legend({ showRadar, showSatellite, showAlerts }: LegendProps) {
  const hasAny = showRadar || showSatellite || showAlerts;

  return (
    <div className="legend">
      {showRadar && (
        <div className="legend__block">
          <div className="legend__title">Reflectivity / precipitation</div>
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
      )}

      {showSatellite && (
        <div className="legend__block">
          <div className="legend__title">Cloud cover (GOES IR)</div>
          <p className="legend__note">
            Grayscale = cloud-top brightness temperature. Green/yellow/blue highlights mark
            colder, higher cloud tops — often associated with strong convection.
          </p>
        </div>
      )}

      {showAlerts && (
        <div className="legend__block">
          <div className="legend__title">Watches / warnings</div>
          <ul className="legend-swatch-list">
            {ALERT_SEVERITIES.map((severity) => (
              <li key={severity} className="legend-swatch-list__item">
                <span
                  className="legend-swatch-list__swatch"
                  style={{ background: ALERT_SEVERITY_COLOR[severity] }}
                />
                <span>{severity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!hasAny && <div className="legend__empty">No active layers with a legend.</div>}
    </div>
  );
}
