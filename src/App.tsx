import { useState } from "react";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import TimelineStrip from "./components/TimelineStrip";
import { useNwsAlerts } from "./hooks/useNwsAlerts";
import { DEFAULT_ALERTS_STATE } from "./lib/nwsAlerts";
import "./App.css";

function App() {
  const [showReflectivity, setShowReflectivity] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const { data: alertsData } = useNwsAlerts(DEFAULT_ALERTS_STATE);

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
        />
        <Sidebar
          showReflectivity={showReflectivity}
          showPrecipitation={showPrecipitation}
          showSatellite={showSatellite}
          showAlerts={showAlerts}
          alertsData={alertsData}
          onToggleReflectivity={() => setShowReflectivity((v) => !v)}
          onTogglePrecipitation={() => setShowPrecipitation((v) => !v)}
          onToggleSatellite={() => setShowSatellite((v) => !v)}
          onToggleAlerts={() => setShowAlerts((v) => !v)}
        />
      </div>
      <TimelineStrip />
    </div>
  );
}

export default App;
