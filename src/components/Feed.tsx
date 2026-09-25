import { useApp } from "../context";
import { FRIENDS, RESTAURANTS } from "../data/seed";
import { friendAverage, friendScores, getFriend, getRestaurant, timeAgo } from "../lib/helpers";
import type { Activity } from "../lib/types";
import { Avatar, Cover, ScoreBadge, SectionTitle, Thumb } from "./common";

export function Feed() {
  const { state, push } = useApp();
  const items = state.activity
    .filter((a) => a.userId === "me" || state.following.includes(a.userId))
    .sort((a, b) => b.at.localeCompare(a.at));

  const trending = RESTAURANTS.map((r) => ({ r, n: friendScores(r.id, state.following).length, avg: friendAverage(r.id, state.following) }))
    .filter((x) => x.n >= 2 && x.avg !== undefined)
    .sort((a, b) => b.avg! - a.avg!)
    .slice(0, 8);

  const suggested = FRIENDS.filter((f) => !state.following.includes(f.id));

  return (
    <div className="view">
      <header className="brandbar">
        <span className="wordmark">beli</span>
        <span className="muted small">New York</span>
      </header>

      {trending.length > 0 && (
        <>
          <SectionTitle>Trending with friends</SectionTitle>
          <div className="carousel">
            {trending.map(({ r, n, avg }) => (
              <button key={r.id} className="mini-card" onClick={() => push({ kind: "restaurant", id: r.id })}>
                <span className="mini-cover">
                  <Thumb restaurant={r} size={140} />
                  <span className="mini-score"><ScoreBadge score={avg} size="sm" /></span>
                </span>
                <strong>{r.name}</strong>
                <span className="muted small">{n} friends · {r.neighborhood}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {suggested.length > 0 && (
        <>
          <SectionTitle>People to follow</SectionTitle>
          <div className="carousel">
            {suggested.map((f) => (
              <button key={f.id} className="person-card" onClick={() => push({ kind: "friend", id: f.id })}>
                <Avatar emoji={f.avatar} size={56} />
                <strong>{f.name}</strong>
                <span className="muted small">{Object.keys(f.scores).length} places</span>
              </button>
            ))}
          </div>
        </>
      )}

      <SectionTitle>Recent activity</SectionTitle>
      {items.map((a) => <FeedCard key={a.id} activity={a} />)}
    </div>
  );
}

function FeedCard({ activity: a }: { activity: Activity }) {
  const { state, dispatch, scores, push } = useApp();
  const r = getRestaurant(a.restaurantId);
  const friend = getFriend(a.userId);
  const isMe = a.userId === "me";
  const liked = state.likedActivity.includes(a.id);
  const likes = (a.likes ?? 0) + (liked ? 1 : 0);
  const saved = state.wantToTry.includes(r.id);
  const been = r.id in scores;

  return (
    <article className="card feed-card">
      <div className="card-head">
        <button onClick={() => friend && push({ kind: "friend", id: friend.id })}>
          <Avatar emoji={isMe ? "🙂" : friend?.avatar ?? "👤"} />
        </button>
        <span className="grow">
          <strong>{isMe ? "You" : friend?.name}</strong>{" "}
          {a.kind === "ranked" ? "ranked" : "wants to try"}{" "}
          <button className="inline-link" onClick={() => push({ kind: "restaurant", id: r.id })}>{r.name}</button>
          <span className="muted small block">{r.neighborhood} · {timeAgo(a.at)}</span>
        </span>
        {a.kind === "ranked" && <ScoreBadge score={a.score} />}
      </div>

      {a.kind === "ranked" && (
        <button className="feed-cover" onClick={() => push({ kind: "restaurant", id: r.id })}>
          <Cover restaurant={r} height={150} />
        </button>
      )}

      {a.note && <p className="quote">“{a.note}”</p>}

      <div className="card-actions">
        {!isMe && (
          <button className={`action like ${liked ? "on" : ""}`} onClick={() => dispatch({ type: "toggleLike", activityId: a.id })}>
            {liked ? "♥" : "♡"} {likes > 0 && likes}
          </button>
        )}
        {!been && (
          <button className={`action save ${saved ? "on" : ""}`} onClick={() => dispatch({ type: "toggleWantToTry", restaurantId: r.id })}>
            🔖 {saved ? "Saved" : "Save"}
          </button>
        )}
        <span className="grow" />
        {been ? (
          <span className="muted small">You: <b>{scores[r.id].toFixed(1)}</b></span>
        ) : (
          <button className="action accent" onClick={() => push({ kind: "rank", id: r.id })}>＋ Rank</button>
        )}
      </div>
    </article>
  );
}
