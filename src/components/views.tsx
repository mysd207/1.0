import { useMemo, useState } from "react";
import { FRIENDS, RESTAURANTS } from "../data/seed";
import { friendAverage, getFriend, getRestaurant, timeAgo } from "../lib/helpers";
import { overallOrder, scoresFor } from "../lib/ranking";
import type { AppState } from "../lib/types";
import { EmptyState, RestaurantRow, ScoreBadge } from "./common";

type Open = (restaurantId: string) => void;

export function FeedView({ state, onOpen }: { state: AppState; onOpen: Open }) {
  const items = [...state.activity].sort((a, b) => b.at.localeCompare(a.at));
  return (
    <div className="view">
      <h1>Feed</h1>
      {items.map((a) => {
        const r = getRestaurant(a.restaurantId);
        const friend = getFriend(a.userId);
        const who = a.userId === "me" ? "You" : friend?.name ?? "Someone";
        return (
          <button key={a.id} className="card" onClick={() => onOpen(a.restaurantId)}>
            <div className="card-head">
              <span className="avatar">{a.userId === "me" ? "🙂" : friend?.avatar}</span>
              <span className="grow">
                <strong>{who}</strong> {a.kind === "ranked" ? "ranked" : "bookmarked"} <strong>{r.name}</strong>
                <span className="muted small"> · {timeAgo(a.at)}</span>
              </span>
              {a.kind === "ranked" && <ScoreBadge score={a.score} />}
            </div>
            <p className="muted small">{r.emoji} {r.cuisine} · {r.neighborhood}</p>
            {a.note && <p className="card-note">“{a.note}”</p>}
          </button>
        );
      })}
    </div>
  );
}

type ListTab = "been" | "want" | "recs";

export function ListsView({ state, onOpen }: { state: AppState; onOpen: Open }) {
  const [tab, setTab] = useState<ListTab>("been");
  const scores = useMemo(() => scoresFor(state.rankings), [state.rankings]);
  const been = overallOrder(state.rankings);

  const recs = useMemo(
    () =>
      RESTAURANTS.filter((r) => !(r.id in scores))
        .map((r) => ({ r, avg: friendAverage(r.id) }))
        .filter((x): x is { r: typeof x.r; avg: number } => x.avg !== undefined)
        .sort((a, b) => b.avg - a.avg),
    [scores],
  );

  return (
    <div className="view">
      <h1>My Lists</h1>
      <div className="segmented">
        <button className={tab === "been" ? "on" : ""} onClick={() => setTab("been")}>Been ({been.length})</button>
        <button className={tab === "want" ? "on" : ""} onClick={() => setTab("want")}>Want to Try ({state.wantToTry.length})</button>
        <button className={tab === "recs" ? "on" : ""} onClick={() => setTab("recs")}>Recs</button>
      </div>

      {tab === "been" &&
        (been.length === 0 ? (
          <EmptyState title="No rankings yet" body="Search for a place you've been and rank it to start your list." />
        ) : (
          been.map((id, i) => (
            <RestaurantRow key={id} restaurant={getRestaurant(id)} rank={i + 1} score={scores[id]} onClick={() => onOpen(id)} />
          ))
        ))}

      {tab === "want" &&
        (state.wantToTry.length === 0 ? (
          <EmptyState title="Nothing saved" body="Bookmark places you want to try from the feed or search." />
        ) : (
          state.wantToTry.map((id) => <RestaurantRow key={id} restaurant={getRestaurant(id)} onClick={() => onOpen(id)} />)
        ))}

      {tab === "recs" && (
        <>
          <p className="muted small">Places you haven't been, ranked by your friends' scores.</p>
          {recs.map(({ r, avg }) => (
            <RestaurantRow key={r.id} restaurant={r} score={avg} onClick={() => onOpen(r.id)} />
          ))}
        </>
      )}
    </div>
  );
}

export function SearchView({ state, onOpen }: { state: AppState; onOpen: Open }) {
  const [q, setQ] = useState("");
  const scores = useMemo(() => scoresFor(state.rankings), [state.rankings]);
  const query = q.trim().toLowerCase();
  const results = RESTAURANTS.filter(
    (r) => !query || [r.name, r.cuisine, r.neighborhood].some((f) => f.toLowerCase().includes(query)),
  );
  return (
    <div className="view">
      <h1>Search</h1>
      <input
        className="search"
        type="search"
        placeholder="Restaurant, cuisine, or neighborhood"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus
      />
      {results.length === 0 && <EmptyState title="No matches" body="Try a different name or cuisine." />}
      {results.map((r) => (
        <RestaurantRow
          key={r.id}
          restaurant={r}
          onClick={() => onOpen(r.id)}
          trailing={
            r.id in scores ? (
              <ScoreBadge score={scores[r.id]} />
            ) : state.wantToTry.includes(r.id) ? (
              <span className="tag">🔖</span>
            ) : undefined
          }
        />
      ))}
    </div>
  );
}

export function LeaderboardView({ state }: { state: AppState }) {
  const myCount = overallOrder(state.rankings).length;
  const rows = [
    { id: "me", name: "You", avatar: "🙂", count: myCount },
    ...FRIENDS.map((f) => ({ id: f.id, name: f.name, avatar: f.avatar, count: Object.keys(f.scores).length })),
  ].sort((a, b) => b.count - a.count);

  return (
    <div className="view">
      <h1>Leaderboard</h1>
      <p className="muted small">Most restaurants ranked among you and your friends.</p>
      {rows.map((row, i) => (
        <div key={row.id} className={`row static ${row.id === "me" ? "me" : ""}`}>
          <span className="row-rank">{i + 1}</span>
          <span className="avatar">{row.avatar}</span>
          <span className="row-body">
            <span className="row-title">{row.name}</span>
          </span>
          <span className="count">{row.count}</span>
        </div>
      ))}
    </div>
  );
}

export function ProfileView({ state, onOpen, onReset }: { state: AppState; onOpen: Open; onReset: () => void }) {
  const scores = scoresFor(state.rankings);
  const order = overallOrder(state.rankings);
  const cuisines = new Map<string, number>();
  for (const id of order) {
    const c = getRestaurant(id).cuisine;
    cuisines.set(c, (cuisines.get(c) ?? 0) + 1);
  }
  const topCuisines = [...cuisines.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div className="view">
      <div className="profile-head">
        <span className="avatar big">🙂</span>
        <h1>You</h1>
      </div>
      <div className="stat-row">
        <div className="stat"><strong className="big-num">{order.length}</strong><span className="muted">Been</span></div>
        <div className="stat"><strong className="big-num">{state.wantToTry.length}</strong><span className="muted">Want to try</span></div>
        <div className="stat"><strong className="big-num">{FRIENDS.length}</strong><span className="muted">Friends</span></div>
      </div>

      {topCuisines.length > 0 && (
        <section>
          <h3>Top cuisines</h3>
          <div className="chips">
            {topCuisines.map(([c, n]) => <span key={c} className="chip">{c} · {n}</span>)}
          </div>
        </section>
      )}

      <section>
        <h3>Your top 5</h3>
        {order.length === 0 ? (
          <p className="muted">Rank a few places to see your favorites here.</p>
        ) : (
          order.slice(0, 5).map((id, i) => (
            <RestaurantRow key={id} restaurant={getRestaurant(id)} rank={i + 1} score={scores[id]} onClick={() => onOpen(id)} />
          ))
        )}
      </section>

      <button
        className="btn subtle"
        onClick={() => {
          if (confirm("Clear all your rankings and saved places?")) onReset();
        }}
      >
        Reset demo data
      </button>
    </div>
  );
}
