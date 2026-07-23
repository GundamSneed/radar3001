import { useCallback, useState } from "react";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import TimelineStrip from "./components/TimelineStrip";
import { useNwsAlerts } from "./hooks/useNwsAlerts";
import { useStationObservation } from "./hooks/useStationObservation";
import { useRainViewerData } from "./hooks/useRainViewerData";
import { useTimelinePlayback, type TimeMode } from "./hooks/useTimelinePlayback";
import { DEFAULT_ALERTS_STATE } from "./lib/nwsAlerts";
import { getStateByCode } from "./lib/usStates";
import { geocodeLocation } from "./lib/geocoding";
import "./App.css";

const REGION_ZOOM = 6;
const SEARCH_ZOOM = 10;

interface MapTarget {
  lat: number;
  lon: number;
  zoom: number;
}

function targetForRegion(code: string): MapTarget {
  const state = getStateByCode(code);
  return state ? { lat: state.lat, lon: state.lon, zoom: REGION_ZOOM } : { lat: 39.8, lon: -98.5, zoom: REGION_ZOOM };
}

function App() {
  const [showReflectivity, setShowReflectivity] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showWind, setShowWind] = useState(true);

  const [region, setRegion] = useState(DEFAULT_ALERTS_STATE);
  const [timeMode, setTimeMode] = useState<TimeMode>("live");
  const [mapTarget, setMapTarget] = useState<MapTarget>(() => targetForRegion(DEFAULT_ALERTS_STATE));

  const { data: alertsData } = useNwsAlerts(region);
  const { data: windObs } = useStationObservation(mapTarget.lat, mapTarget.lon);
  const { data: rainViewerData } = useRainViewerData();
  const timeline = useTimelinePlayback(rainViewerData, timeMode === "live");

  const handleRegionChange = useCallback((code: string) => {
    setRegion(code);
    setMapTarget(targetForRegion(code));
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const result = await geocodeLocation(query).catch(() => null);
    if (!result) return false;
    setMapTarget({ lat: result.lat, lon: result.lon, zoom: SEARCH_ZOOM });
    if (result.stateCode) setRegion(result.stateCode);
    return true;
  }, []);

  return (
    <div className="app-shell">
      <Toolbar
        region={region}
        onRegionChange={handleRegionChange}
        timeMode={timeMode}
        onTimeModeChange={setTimeMode}
        onSearch={handleSearch}
      />
      <div className="app-main">
        <MapView
          showReflectivity={showReflectivity}
          showPrecipitation={showPrecipitation}
          showSatellite={showSatellite}
          showAlerts={showAlerts}
          alertsData={alertsData}
          showWind={showWind}
          windObs={windObs}
          radarHost={rainViewerData?.host ?? null}
          radarFrame={timeline.currentFrame}
          flyTo={mapTarget}
        />
        <Sidebar
          showReflectivity={showReflectivity}
          showPrecipitation={showPrecipitation}
          showSatellite={showSatellite}
          showAlerts={showAlerts}
          alertsData={alertsData}
          showWind={showWind}
          onToggleReflectivity={() => setShowReflectivity((v) => !v)}
          onTogglePrecipitation={() => setShowPrecipitation((v) => !v)}
          onToggleSatellite={() => setShowSatellite((v) => !v)}
          onToggleAlerts={() => setShowAlerts((v) => !v)}
          onToggleWind={() => setShowWind((v) => !v)}
        />
      </div>
      <TimelineStrip
        frames={timeline.frames}
        pastCount={timeline.pastCount}
        selectedIndex={timeline.selectedIndex}
        isPlaying={timeline.isPlaying}
        speed={timeline.speed}
        disabled={timeMode === "live"}
        onTogglePlay={timeline.togglePlaying}
        onCycleSpeed={timeline.cycleSpeed}
        onScrub={timeline.scrubTo}
      />
    </div>
  );
}

export default App;
