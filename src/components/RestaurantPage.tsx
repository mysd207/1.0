import { useApp } from "../context";
import { RESTAURANTS } from "../data/seed";
import { friendAverage, friendScores, getRestaurant, priceLabel } from "../lib/helpers";
import { Avatar, Cover, ScoreBadge, SectionTitle, Thumb } from "./common";

export function RestaurantPage({ restaurantId }: { restaurantId: string }) {
  const { state, dispatch, scores, push, back } = useApp();
  const r = getRestaurant(restaurantId);
  const myScore = scores[restaurantId];
  const visit = state.visits[restaurantId];
  const friends = friendScores(restaurantId, state.following);
  const avg = friendAverage(restaurantId, state.following);
  const saved = state.wantToTry.includes(restaurantId);

  const similar = RESTAURANTS.filter((x) => x.id !== r.id)
    .map((x) => ({
      x,
      overlap: (x.cuisine === r.cuisine ? 2 : 0) + x.tags.filter((t) => r.tags.includes(t)).length,
    }))
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 6);

  return (
    <div className="screen flush">
      <Cover restaurant={r} height={240}>
        <button className="icon-btn floating" onClick={back} aria-label="Back">‹</button>
        {myScore === undefined && (
          <button
            className="icon-btn floating right"
            onClick={() => dispatch({ type: "toggleWantToTry", restaurantId })}
            aria-label="Want to try"
          >
            {saved ? "🔖" : "＋"}
          </button>
        )}
      </Cover>

      <div className="page-body">
        <div className="title-row">
          <div className="grow">
            <h1 className="tight">{r.name}</h1>
            <p className="muted">{r.cuisine} · {priceLabel(r.price)} · {r.neighborhood}</p>
          </div>
          <ScoreBadge score={myScore} size="lg" />
        </div>
        <p className="blurb">{r.blurb}</p>
        <div className="chips">
          {r.tags.map((t) => <span key={t} className="chip static">{t}</span>)}
        </div>

        <div className="stat-row">
          <div className="stat">
            <ScoreBadge score={myScore} />
            <span className="muted small">Your score</span>
          </div>
          <div className="stat">
            <ScoreBadge score={avg} />
            <span className="muted small">Friends' avg</span>
          </div>
          <div className="stat">
            <span className="stat-num">{friends.length}</span>
            <span className="muted small">Friends been</span>
          </div>
        </div>

        <div className="actions">
          <button className="btn primary" onClick={() => push({ kind: "rank", id: restaurantId })}>
            {myScore === undefined ? "✓ I've been here" : "↻ Re-rank"}
          </button>
          {myScore === undefined ? (
            <button className={`btn ${saved ? "active" : ""}`} onClick={() => dispatch({ type: "toggleWantToTry", restaurantId })}>
              {saved ? "🔖 On your list" : "🔖 Want to try"}
            </button>
          ) : (
            <button
              className="btn"
              onClick={() => {
                if (confirm(`Remove ${r.name} from your list?`)) dispatch({ type: "unrank", restaurantId });
              }}
            >
              Remove
            </button>
          )}
        </div>

        {visit && (
          <>
            <SectionTitle>Your visit</SectionTitle>
            <div className="card">
              <p className="muted small">Ranked {new Date(visit.visitedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
              {visit.note && <p className="quote">“{visit.note}”</p>}
              {visit.tags.length > 0 && (
                <div className="chips">{visit.tags.map((t) => <span key={t} className="chip static on">{t}</span>)}</div>
              )}
            </div>
          </>
        )}

        <SectionTitle>What friends think</SectionTitle>
        {friends.length === 0 ? (
          <p className="muted">None of the friends you follow have ranked this yet. Be the first!</p>
        ) : (
          <div className="stack">
            {friends.map(({ friend, score, note }) => (
              <button key={friend.id} className="review" onClick={() => push({ kind: "friend", id: friend.id })}>
                <Avatar emoji={friend.avatar} />
                <span className="grow">
                  <strong>{friend.name}</strong>
                  {note && <span className="review-note">“{note}”</span>}
                </span>
                <ScoreBadge score={score} size="sm" />
              </button>
            ))}
          </div>
        )}

        {similar.length > 0 && (
          <>
            <SectionTitle>You might also like</SectionTitle>
            <div className="carousel">
              {similar.map(({ x }) => (
                <button key={x.id} className="mini-card" onClick={() => push({ kind: "restaurant", id: x.id })}>
                  <Thumb restaurant={x} size={120} />
                  <strong>{x.name}</strong>
                  <span className="muted small">{x.cuisine} · {priceLabel(x.price)}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
