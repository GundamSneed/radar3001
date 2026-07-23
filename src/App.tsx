import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import TimelineStrip from "./components/TimelineStrip";
import { useNwsAlerts } from "./hooks/useNwsAlerts";
import { useStationObservation } from "./hooks/useStationObservation";
import { DEFAULT_ALERTS_STATE } from "./lib/nwsAlerts";
import { DEFAULT_OBS_LOCATION } from "./lib/nwsStations";
import "./App.css";

function App() {
  const [showReflectivity, setShowReflectivity] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showWind, setShowWind] = useState(true);
  const { data: alertsData } = useNwsAlerts(DEFAULT_ALERTS_STATE);
  const { data: windObs } = useStationObservation(DEFAULT_OBS_LOCATION.lat, DEFAULT_OBS_LOCATION.lon);

  return (
    <div className="app-shell">
      <Toolbar />
      <div className="app-main">
        <MapView
          showReflectivity={showReflectivity}
          showPrecipitation={showPrecipitation}
          showSatellite={showSatellite}
          showAlerts={showAlerts}
          alertsData={alertsData}
          showWind={showWind}
          windObs={windObs}
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
      <TimelineStrip />
    </div>
  );
}

export default App;
