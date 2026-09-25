import { useState } from "react";
import { useApp } from "../context";
import { RESTAURANTS } from "../data/seed";
import { friendAverage } from "../lib/helpers";
import { EmptyState, RestaurantRow, ScoreBadge } from "./common";

const CUISINES = [...new Set(RESTAURANTS.map((r) => r.cuisine))].sort();

export function Search() {
  const { state, scores, push } = useApp();
  const [q, setQ] = useState("");
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const query = q.trim().toLowerCase();
  const results = RESTAURANTS.filter(
    (r) =>
      (!query || [r.name, r.cuisine, r.neighborhood, ...r.tags].some((f) => f.toLowerCase().includes(query))) &&
      (!cuisine || r.cuisine === cuisine) &&
      (!price || r.price === price),
  )
    .map((r) => ({ r, avg: friendAverage(r.id, state.following) }))
    .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1));

  return (
    <div className="view">
      <h1>Search</h1>
      <div className="search-box">
        <span>🔍</span>
        <input
          type="search"
          placeholder="Restaurant, cuisine, neighborhood, vibe…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="chips scroll">
        {[1, 2, 3, 4].map((p) => (
          <button key={p} className={`chip ${price === p ? "on" : ""}`} onClick={() => setPrice(price === p ? null : p)}>
            {"$".repeat(p)}
          </button>
        ))}
        <span className="chip-divider" />
        {CUISINES.map((c) => (
          <button key={c} className={`chip ${cuisine === c ? "on" : ""}`} onClick={() => setCuisine(cuisine === c ? null : c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="muted small">{results.length} {results.length === 1 ? "result" : "results"} · sorted by friends' scores</p>
      {results.length === 0 && <EmptyState icon="🤷" title="No matches" body="Try a different name, cuisine, or clear the filters." />}
      {results.map(({ r, avg }) => {
        const mine = scores[r.id];
        const saved = state.wantToTry.includes(r.id);
        return (
          <RestaurantRow
            key={r.id}
            restaurant={r}
            onClick={() => push({ kind: "restaurant", id: r.id })}
            trailing={
              <span className="trail">
                {mine !== undefined ? (
                  <ScoreBadge score={mine} />
                ) : (
                  <>
                    {saved && <span className="tag">🔖</span>}
                    {avg !== undefined && <span className="friend-avg">👥 {avg.toFixed(1)}</span>}
                  </>
                )}
              </span>
            }
          />
        );
      })}
    </div>
  );
}
