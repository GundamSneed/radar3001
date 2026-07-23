import "./TimelineStrip.css";

export default function TimelineStrip() {
  return (
    <footer className="timeline">
      <button className="timeline__play" type="button" aria-label="Play">
        ▶
      </button>
      <div className="timeline__body">
        <div className="timeline__track">
          <div className="timeline__track-fill" />
          <div className="timeline__scrubber" />
        </div>
        <div className="timeline__meta">
          <span>-6h</span>
          <span className="timeline__meta-now">now</span>
          <span>refresh ~5-10min</span>
        </div>
      </div>
      <button className="timeline__speed" type="button">
        1x
      </button>
    </footer>
  );
}
