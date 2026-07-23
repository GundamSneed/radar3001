import "./Sidebar.css";

const LAYERS = [
  "Reflectivity",
  "Precipitation",
  "Cloud cover (satellite)",
  "Watches / warnings",
  "Wind / surface obs",
];

const PLANNED_LAYERS = [
  "Velocity",
  "Precip type",
  "Storm tracks",
  "Hail / freezing level",
  "Lightning",
];

export default function Sidebar() {
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
        {LAYERS.map((label) => (
          <li className="layer-list__item" key={label}>
            <span className="layer-list__swatch" />
            <span>{label}</span>
          </li>
        ))}
      </ul>

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
