import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import MapPlaceholder from "./components/MapPlaceholder";
import TimelineStrip from "./components/TimelineStrip";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Toolbar />
      <div className="app-main">
        <MapPlaceholder />
        <Sidebar />
      </div>
      <TimelineStrip />
    </div>
  );
}

export default App;
