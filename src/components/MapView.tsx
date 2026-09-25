import { useState } from "react";
import { useApp } from "../context";
import { RESTAURANTS } from "../data/seed";
import { friendAverage, scoreTone } from "../lib/helpers";
import { RestaurantRow } from "./common";

// A stylized map of NYC. Shapes are rough on purpose; this is a prototype.
const BOUNDS = { minLat: 40.61, maxLat: 40.825, minLng: -74.045, maxLng: -73.865 };
const KX = Math.cos((40.72 * Math.PI) / 180);
const W = 360;
const H = Math.round((W * (BOUNDS.maxLat - BOUNDS.minLat)) / ((BOUNDS.maxLng - BOUNDS.minLng) * KX));

function project(lat: number, lng: number): [number, number] {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * W;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function poly(points: [number, number][]): string {
  return points.map(([lat, lng]) => project(lat, lng).join(",")).join(" ");
}

const LAND = {
  manhattan: poly([
    [40.7, -74.018], [40.708, -73.998], [40.711, -73.977], [40.728, -73.971], [40.745, -73.971],
    [40.775, -73.943], [40.797, -73.929], [40.84, -73.934], [40.84, -73.948], [40.82, -73.958],
    [40.76, -74.004], [40.74, -74.012], [40.71, -74.02],
  ]),
  brooklynQueens: poly([
    [40.58, -74.04], [40.64, -74.042], [40.67, -74.022], [40.69, -74.004], [40.7, -73.993],
    [40.705, -73.975], [40.72, -73.962], [40.74, -73.958], [40.76, -73.94], [40.78, -73.92],
    [40.79, -73.9], [40.8, -73.87], [40.84, -73.86], [40.84, -73.8], [40.58, -73.8],
  ]),
  newJersey: poly([
    [40.84, -74.2], [40.84, -73.962], [40.8, -73.976], [40.76, -74.012], [40.72, -74.031],
    [40.68, -74.052], [40.64, -74.076], [40.6, -74.09], [40.58, -74.2],
  ]),
  bronx: poly([[40.84, -73.93], [40.806, -73.926], [40.8, -73.905], [40.84, -73.87]]),
};

const LABELS: { text: string; lat: number; lng: number }[] = [
  { text: "MANHATTAN", lat: 40.772, lng: -73.972 },
  { text: "BROOKLYN", lat: 40.655, lng: -73.955 },
  { text: "QUEENS", lat: 40.748, lng: -73.9 },
  { text: "NEW JERSEY", lat: 40.715, lng: -74.043 },
];

type Filter = "all" | "been" | "want";

export function MapView() {
  const { state, scores, push } = useApp();
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const visible = RESTAURANTS.filter((r) =>
    filter === "been" ? r.id in scores : filter === "want" ? state.wantToTry.includes(r.id) : true,
  );
  const sel = visible.find((r) => r.id === selected);

  return (
    <div className="map-wrap">
      <div className="chips">
        {(["all", "been", "want"] as Filter[]).map((f) => (
          <button key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "Everything" : f === "been" ? "✓ Been" : "🔖 Want to try"}
          </button>
        ))}
      </div>
      <svg className="map" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Map of restaurants">
        <defs>
          <pattern id="streets" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(29)">
            <path d="M0 0H14M0 0V14" className="map-street" />
          </pattern>
        </defs>
        <rect width={W} height={H} className="map-water" />
        {Object.entries(LAND).map(([k, pts]) => (
          <g key={k}>
            <polygon points={pts} className="map-land" />
            <polygon points={pts} fill="url(#streets)" />
          </g>
        ))}
        {LABELS.map((l) => {
          const [x, y] = project(l.lat, l.lng);
          return <text key={l.text} x={x} y={y} className="map-label">{l.text}</text>;
        })}
        {visible.map((r) => {
          const [x, y] = project(r.lat, r.lng);
          const mine = scores[r.id];
          const want = state.wantToTry.includes(r.id);
          const avg = friendAverage(r.id, state.following);
          const tone = mine !== undefined ? scoreTone(mine) : want ? "want" : "other";
          return (
            <g
              key={r.id}
              className={`pin pin-${tone} ${selected === r.id ? "pin-selected" : ""}`}
              transform={`translate(${x} ${y})`}
              onClick={() => setSelected(r.id)}
            >
              <circle r={mine !== undefined ? 14 : 12} />
              <text dy="0.35em">{mine !== undefined ? mine.toFixed(1) : want ? "🔖" : r.emoji}</text>
              {avg !== undefined && mine === undefined && !want && <circle className="pin-dot" cx={9} cy={-9} r={3.5} />}
            </g>
          );
        })}
      </svg>
      <div className="map-legend muted small">
        <span><i className="dot good" /> Your score</span>
        <span><i className="dot want" /> Want to try</span>
        <span><i className="dot friends" /> Friends have been</span>
      </div>
      {sel ? (
        <RestaurantRow restaurant={sel} score={scores[sel.id]} onClick={() => push({ kind: "restaurant", id: sel.id })} />
      ) : (
        <p className="muted small center-text">Tap a pin to preview a restaurant.</p>
      )}
    </div>
  );
}
