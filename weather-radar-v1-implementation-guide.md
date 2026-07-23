# Weather radar dashboard — v1 implementation guide

Handoff spec for AI coding agents. v1 is **frontend-only**, free/keyless APIs, no backend.

**Visual reference:** see `weather-radar-v1-mockup.svg` (same folder) — rough wireframe of the v1 layout and layer list. Not pixel-accurate; use it for structure/placement, not exact styling.

## Stack

- **Frontend:** React + Vite
- **Map:** Leaflet (no API key required; works directly with tile URLs)
- **State:** React state/hooks — no external state library needed for v1 scope
- **Hosting:** static (Vercel/Netlify/GitHub Pages — any static host works)

## Design reference

- Dark, utilitarian palette. Base bg `#0e1013`, panels `#1a1d22`/`#14171c`, borders `#2c3038`/`#3a3f48`, primary text `#e4e6ea`, secondary text `#c7cad0`, muted `#6a6f78`, accent blue `#3a6ea5`/`#8fc4ff`.
- Layout: top toolbar (time range, region, location search) → main area = map (left) + collapsible right sidebar (layers + legend) → bottom timeline/playback strip.
- Sidebar v1 layers: Reflectivity, Precipitation, Cloud cover (satellite), Watches/warnings, Wind/surface obs. Include a visually distinct "planned — later phase" section (velocity, precip type, storm tracks, hail, lightning) so the roadmap stays visible but inactive.

## Data sources (v1 — free, keyless)

| Feature | Source | Notes |
|---|---|---|
| Reflectivity + precipitation | RainViewer API | `GET https://api.rainviewer.com/public/weather-maps.json` returns tile URL templates + frame timestamps for radar |
| Cloud cover / satellite | RainViewer API | Same response includes infrared satellite frames — one integration covers both |
| Watches / warnings | NWS API | `GET https://api.weather.gov/alerts/active?area={state}` — GeoJSON polygons |
| Wind / surface obs | NWS API | `GET https://api.weather.gov/points/{lat},{lon}` → resolves to nearest station → `.../stations/{id}/observations/latest` |

No API keys needed for any of the above. Set a descriptive `User-Agent` header on NWS API requests (required by their usage policy).

## Build phases

### Phase 1 — Scaffold (sequential, do first)
- [ ] Init React + Vite project
- [ ] Install Leaflet + react-leaflet
- [ ] Set up base layout shell: top toolbar, map container, right sidebar, bottom strip (static, no data yet)
- [ ] Apply dark palette as CSS variables/theme

### Phase 2 — Independent feature tracks (parallelizable — no shared dependencies)

**Track A: Map + radar/precip/satellite tiles**
- [ ] Integrate Leaflet base map
- [ ] Fetch RainViewer `weather-maps.json`, render radar tile layer
- [ ] Render satellite (IR) tile layer as a toggleable overlay
- [ ] Wire sidebar checkboxes for Reflectivity / Precipitation / Cloud cover to show/hide layers

**Track B: Alerts/warnings overlay**
- [ ] Fetch NWS `/alerts/active` for selected region
- [ ] Render alert polygons on map (color by severity)
- [ ] Wire sidebar checkbox for Watches/warnings
- [ ] Click-to-inspect: show alert headline/description in a popup or the "station details" panel

**Track C: Wind/surface obs overlay**
- [ ] Resolve lat/lon → NWS station via `/points/{lat},{lon}`
- [ ] Fetch latest observation, render as a point marker or wind-barb icon
- [ ] Wire sidebar checkbox for Wind/surface obs

**Track D: Sidebar chrome**
- [ ] Collapsible sidebar (toggle button, animate width)
- [ ] Legend component (color scale, updates based on active layer)
- [ ] Static "planned — later phase" section (no data wiring needed)

### Phase 3 — Timeline/playback (depends on Track A)
- [ ] Use RainViewer frame timestamps to populate the timeline strip
- [ ] Scrubber selects frame → updates tile layer to that timestamp
- [ ] Play/pause animates through past frames (RainViewer provides ~2hr history)

### Phase 4 — Toolbar controls (depends on Tracks A–C)
- [ ] Region selector (filters which NWS alerts/obs are fetched)
- [ ] Location search (geocode → recenter map, resolve nearest station)
- [ ] Time range control (past/live — forecast is out of scope until model-overlay phase)

### Phase 5 — Polish (do last)
- [ ] Loading/empty/error states for each data source
- [ ] Responsive check down to smaller desktop widths
- [ ] Rate-limit / fetch-failure handling (RainViewer and NWS can both be briefly unavailable)

## Explicitly out of scope for v1

Velocity, dual-pol products, precipitation type, storm tracks/rotation, hail probability, freezing level/echo tops, forecast model overlay, lightning. These require a raw NEXRAD Level 2 / MRMS processing pipeline (Py-ART parsing, dealiasing, gridding, tile rendering, backend worker) — a separate future phase, not part of this guide.
