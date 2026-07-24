import { useRef } from "react";
import type { TimelineFrame } from "../hooks/useTimelinePlayback";
import "./TimelineStrip.css";

interface TimelineStripProps {
  frames: TimelineFrame[];
  pastCount: number;
  selectedIndex: number;
  isPlaying: boolean;
  speed: number;
  disabled: boolean;
  loading: boolean;
  error: string | null;
  onTogglePlay: () => void;
  onCycleSpeed: () => void;
  onScrub: (index: number) => void;
  onRetry: () => void;
}

function formatClockTime(unixSeconds: number): string {
  return new Date(unixSeconds * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatRelative(unixSeconds: number, referenceSeconds: number): string {
  const diffMin = Math.round((unixSeconds - referenceSeconds) / 60);
  if (diffMin === 0) return "now";
  const abs = Math.abs(diffMin);
  const magnitude = abs >= 60 ? `${Math.round(abs / 60)}h` : `${abs}m`;
  return diffMin > 0 ? `+${magnitude}` : `-${magnitude}`;
}

export default function TimelineStrip({
  frames,
  pastCount,
  selectedIndex,
  isPlaying,
  speed,
  disabled,
  loading,
  error,
  onTogglePlay,
  onCycleSpeed,
  onScrub,
  onRetry,
}: TimelineStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hasFrames = frames.length > 1;
  const interactive = hasFrames && !disabled && !loading && !error;

  const lastIndex = Math.max(frames.length - 1, 1);
  const scrubberPct = hasFrames ? (selectedIndex / lastIndex) * 100 : 0;
  const nowPct = hasFrames ? (Math.max(pastCount - 1, 0) / lastIndex) * 100 : 100;

  const currentFrame = frames[selectedIndex] ?? null;
  const nowFrame = frames[pastCount - 1] ?? currentFrame;
  const referenceTime = nowFrame?.time ?? 0;

  function indexFromClientX(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    return Math.round(ratio * lastIndex);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    onScrub(indexFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || e.buttons !== 1) return;
    onScrub(indexFromClientX(e.clientX));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onScrub(selectedIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onScrub(selectedIndex + 1);
    }
  }

  return (
    <footer className="timeline">
      <button
        className="timeline__play"
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onTogglePlay}
        disabled={!interactive}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <div className="timeline__body">
        <div
          className={`timeline__track${interactive ? "" : " timeline__track--disabled"}${error ? " timeline__track--error" : ""}`}
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          role="slider"
          tabIndex={interactive ? 0 : -1}
          aria-label="Radar frame"
          aria-valuemin={0}
          aria-valuemax={lastIndex}
          aria-valuenow={selectedIndex}
          aria-valuetext={currentFrame ? formatClockTime(currentFrame.time) : undefined}
          onKeyDown={handleKeyDown}
        >
          <div className="timeline__track-fill" style={{ width: `${Math.min(scrubberPct, nowPct)}%` }} />
          <div
            className="timeline__track-nowcast"
            style={{
              left: `${nowPct}%`,
              width: `${Math.max(Math.min(scrubberPct, 100) - nowPct, 0)}%`,
            }}
          />
          <div className="timeline__now-marker" style={{ left: `${nowPct}%` }} />
          {hasFrames && <div className="timeline__scrubber" style={{ left: `${scrubberPct}%` }} />}
        </div>
        <div className="timeline__meta">
          <span>{frames.length ? formatRelative(frames[0].time, referenceTime) : "-2h"}</span>
          <span className="timeline__meta-now">
            {error ? (
              <span className="timeline__error">
                Radar unavailable — {error}
                <button type="button" className="timeline__retry" onClick={onRetry}>
                  Retry
                </button>
              </span>
            ) : loading ? (
              "Loading radar…"
            ) : disabled ? (
              "live"
            ) : currentFrame ? (
              formatClockTime(currentFrame.time)
            ) : (
              "--:--"
            )}
            {currentFrame?.isNowcast && <span className="timeline__forecast-tag">forecast</span>}
          </span>
          <span>{frames.length ? formatRelative(frames[frames.length - 1].time, referenceTime) : "live"}</span>
        </div>
      </div>
      <button
        className="timeline__speed"
        type="button"
        onClick={onCycleSpeed}
        disabled={!interactive}
        aria-label="Playback speed"
      >
        {speed}x
      </button>
    </footer>
  );
}
