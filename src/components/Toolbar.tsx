import { useState } from "react";
import { US_STATES } from "../lib/usStates";
import type { TimeMode } from "../hooks/useTimelinePlayback";
import "./Toolbar.css";

type SearchStatus = "idle" | "searching" | "not-found";

interface ToolbarProps {
  region: string;
  onRegionChange: (code: string) => void;
  timeMode: TimeMode;
  onTimeModeChange: (mode: TimeMode) => void;
  onSearch: (query: string) => Promise<boolean>;
}

export default function Toolbar({ region, onRegionChange, timeMode, onTimeModeChange, onSearch }: ToolbarProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<SearchStatus>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setStatus("searching");
    const found = await onSearch(trimmed);
    setStatus(found ? "idle" : "not-found");
  }

  return (
    <header className="toolbar">
      <div className="toolbar__brand">RADAR</div>
      <div className="toolbar__controls">
        <select
          className="toolbar__control"
          value={timeMode}
          onChange={(e) => onTimeModeChange(e.target.value as TimeMode)}
          aria-label="Time range"
        >
          <option value="live">Live</option>
          <option value="past">Past</option>
        </select>
        <select
          className="toolbar__control"
          value={region}
          onChange={(e) => onRegionChange(e.target.value)}
          aria-label="Region"
        >
          {US_STATES.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <form className="toolbar__search" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search location…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setStatus("idle");
          }}
        />
        {status === "searching" && <span className="toolbar__search-status">Searching…</span>}
        {status === "not-found" && (
          <span className="toolbar__search-status toolbar__search-status--error">Not found</span>
        )}
      </form>
    </header>
  );
}
