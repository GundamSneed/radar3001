import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RainViewerData, RainViewerFrame } from "../lib/rainviewer";

export interface TimelineFrame extends RainViewerFrame {
  isNowcast: boolean;
}

const SPEEDS = [1, 2, 4];
const BASE_INTERVAL_MS = 600;

interface TimelinePlayback {
  frames: TimelineFrame[];
  pastCount: number;
  selectedIndex: number;
  currentFrame: TimelineFrame | null;
  isPlaying: boolean;
  speed: number;
  togglePlaying: () => void;
  cycleSpeed: () => void;
  scrubTo: (index: number) => void;
}

export function useTimelinePlayback(data: RainViewerData | null): TimelinePlayback {
  const frames = useMemo<TimelineFrame[]>(() => {
    if (!data) return [];
    return [
      ...data.radar.past.map((f) => ({ ...f, isNowcast: false })),
      ...data.radar.nowcast.map((f) => ({ ...f, isNowcast: true })),
    ];
  }, [data]);

  const pastCount = data?.radar.past.length ?? 0;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);

  // Snap to the latest past frame ("now") whenever a fresh data set arrives.
  const latestPastTimeRef = useRef<number | null>(null);
  useEffect(() => {
    const latest = data?.radar.past.at(-1)?.time ?? null;
    if (latest !== null && latest !== latestPastTimeRef.current) {
      latestPastTimeRef.current = latest;
      setSelectedIndex(Math.max(pastCount - 1, 0));
    }
  }, [data, pastCount]);

  useEffect(() => {
    if (!isPlaying || frames.length < 2) return;
    const interval = setInterval(() => {
      setSelectedIndex((i) => (i + 1) % frames.length);
    }, BASE_INTERVAL_MS / SPEEDS[speedIdx]);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length, speedIdx]);

  const togglePlaying = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  }, []);

  const scrubTo = useCallback(
    (index: number) => {
      if (frames.length === 0) return;
      setIsPlaying(false);
      setSelectedIndex(Math.min(Math.max(index, 0), frames.length - 1));
    },
    [frames.length],
  );

  return {
    frames,
    pastCount,
    selectedIndex,
    currentFrame: frames[selectedIndex] ?? null,
    isPlaying,
    speed: SPEEDS[speedIdx],
    togglePlaying,
    cycleSpeed,
    scrubTo,
  };
}
