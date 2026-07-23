import { useState } from "react";
import { ALERT_SEVERITY_COLOR, type NwsAlertCollection } from "../lib/nwsAlerts";
import "./ZoneAlertsList.css";

interface ZoneAlertsListProps {
  data: NwsAlertCollection | null;
}

export default function ZoneAlertsList({ data }: ZoneAlertsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const zoneAlerts = (data?.features ?? []).filter((f) => f.geometry === null);

  if (zoneAlerts.length === 0) {
    return <div className="zone-alerts__empty">No active zone-only alerts</div>;
  }

  return (
    <ul className="zone-alerts">
      {zoneAlerts.map((feature, index) => {
        const isExpanded = expandedIndex === index;
        const { headline, event, severity, areaDesc, description } = feature.properties;
        const color = ALERT_SEVERITY_COLOR[severity] ?? ALERT_SEVERITY_COLOR.Unknown;

        return (
          <li className="zone-alerts__item" key={feature.id ?? `${event}-${index}`}>
            <button
              type="button"
              className="zone-alerts__header"
              aria-expanded={isExpanded}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <span className="zone-alerts__swatch" style={{ background: color }} />
              <span className="zone-alerts__title">{headline ?? event}</span>
            </button>
            {isExpanded && (
              <div className="zone-alerts__detail">
                <div className="zone-alerts__meta">
                  {severity} &middot; {areaDesc}
                </div>
                <p className="zone-alerts__body">{description}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
