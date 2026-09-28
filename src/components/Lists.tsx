import { useState } from "react";
import { useApp } from "../context";
import { friendAverage, getRestaurant } from "../lib/helpers";
import { overallOrder, SENTIMENTS } from "../lib/ranking";
import type { Sentiment } from "../lib/types";
import { EmptyState, RestaurantRow } from "./common";
import { MapView } from "./MapView";
import { PickedForYou } from "./Taste";

type ListTab = "been" | "want" | "recs";

const BAND_LABEL: Record<Sentiment, string> = { liked: "😍 Liked", fine: "😐 Fine", disliked: "😣 Didn't like" };

export function Lists({ onSearch }: { onSearch: () => void }) {
  const { state, scores, push } = useApp();
  const [tab, setTab] = useState<ListTab>("been");
  const [mode, setMode] = useState<"list" | "map">("list");
  const been = overallOrder(state.rankings);
  const open = (id: string) => push({ kind: "restaurant", id });

  return (
    <div className="view">
      <div className="view-head">
        <h1>My Lists</h1>
        <div className="toggle">
          <button className={mode === "list" ? "on" : ""} onClick={() => setMode("list")} aria-label="List view">☰</button>
          <button className={mode === "map" ? "on" : ""} onClick={() => setMode("map")} aria-label="Map view">🗺</button>
        </div>
      </div>

      {mode === "map" ? (
        <MapView />
      ) : (
        <>
          <div className="segmented">
            <button className={tab === "been" ? "on" : ""} onClick={() => setTab("been")}>Been · {been.length}</button>
            <button className={tab === "want" ? "on" : ""} onClick={() => setTab("want")}>Want to Try · {state.wantToTry.length}</button>
            <button className={tab === "recs" ? "on" : ""} onClick={() => setTab("recs")}>Recs</button>
          </div>

          {tab === "been" &&
            (been.length === 0 ? (
              <EmptyState
                icon="🍽️"
                title="Start your list"
                body="Rank a place you've been. Each new place gets compared against your list, and your scores update as it grows."
                action={<button className="btn primary" onClick={onSearch}>Find a restaurant</button>}
              />
            ) : (
              SENTIMENTS.filter((s) => state.rankings[s].length > 0).map((s) => (
                <section key={s} className="stack">
                  <p className="band-label">{BAND_LABEL[s]} · {state.rankings[s].length}</p>
                  {state.rankings[s].map((id) => (
                    <RestaurantRow key={id} restaurant={getRestaurant(id)} rank={been.indexOf(id) + 1} score={scores[id]} onClick={() => open(id)} />
                  ))}
                </section>
              ))
            ))}

          {tab === "want" &&
            (state.wantToTry.length === 0 ? (
              <EmptyState icon="🔖" title="Nothing saved yet" body="Tap Save on anything in your feed, or tap + on a restaurant page." />
            ) : (
              state.wantToTry.map((id) => {
                const avg = friendAverage(id, state.following);
                return (
                  <RestaurantRow
                    key={id}
                    restaurant={getRestaurant(id)}
                    score={avg}
                    onClick={() => open(id)}
                    subtitle={avg !== undefined ? `Friends' avg · ${getRestaurant(id).neighborhood}` : undefined}
                  />
                );
              })
            ))}

          {tab === "recs" && (
            <>
              <p className="muted small">
                Places you haven't been, with a predicted score that leans on the people whose taste matches yours most.
              </p>
              <PickedForYou limit={20} />
            </>
          )}
        </>
      )}
    </div>
  );
}
