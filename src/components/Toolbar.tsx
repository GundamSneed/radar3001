import "./Toolbar.css";

export default function Toolbar() {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">RADAR</div>
      <div className="toolbar__controls">
        <button className="toolbar__control" type="button">
          Time range ▾
        </button>
        <button className="toolbar__control" type="button">
          Region ▾
        </button>
      </div>
      <div className="toolbar__search">
        <input type="text" placeholder="Search location…" />
      </div>
    </header>
  );
}
