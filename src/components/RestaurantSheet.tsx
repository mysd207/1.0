import { friendAverage, friendScores, getRestaurant, priceLabel } from "../lib/helpers";
import type { Visit } from "../lib/types";
import { ScoreBadge } from "./common";

export function RestaurantSheet({
  restaurantId,
  myScore,
  visit,
  wantToTry,
  onClose,
  onRank,
  onUnrank,
  onToggleWantToTry,
}: {
  restaurantId: string;
  myScore?: number;
  visit?: Visit;
  wantToTry: boolean;
  onClose: () => void;
  onRank: () => void;
  onUnrank: () => void;
  onToggleWantToTry: () => void;
}) {
  const r = getRestaurant(restaurantId);
  const friends = friendScores(restaurantId);
  const avg = friendAverage(restaurantId);

  return (
    <div className="sheet">
      <div className="flow-head">
        <button className="link" onClick={onClose}>← Back</button>
      </div>
      <div className="hero">
        <span className="hero-emoji">{r.emoji}</span>
        <h2>{r.name}</h2>
        <p className="muted">
          {r.cuisine} · {priceLabel(r.price)} · {r.neighborhood}, {r.city}
        </p>
      </div>

      <div className="stat-row">
        <div className="stat">
          <ScoreBadge score={myScore} size="lg" />
          <span className="muted">Your score</span>
        </div>
        <div className="stat">
          <ScoreBadge score={avg} size="lg" />
          <span className="muted">Friends' avg</span>
        </div>
      </div>

      <div className="actions">
        <button className="btn primary" onClick={onRank}>
          {myScore === undefined ? "＋ Rank it" : "Re-rank"}
        </button>
        {myScore === undefined ? (
          <button className={`btn ${wantToTry ? "active" : ""}`} onClick={onToggleWantToTry}>
            {wantToTry ? "🔖 Saved" : "🔖 Want to try"}
          </button>
        ) : (
          <button className="btn" onClick={onUnrank}>Remove</button>
        )}
      </div>

      {visit?.note && (
        <section>
          <h3>Your notes</h3>
          <p className="note-text">{visit.note}</p>
        </section>
      )}

      <section>
        <h3>Friends who've been</h3>
        {friends.length === 0 ? (
          <p className="muted">None of your friends have ranked this yet.</p>
        ) : (
          <ul className="plain">
            {friends.map(({ friend, score }) => (
              <li key={friend.id} className="friend-score">
                <span className="avatar">{friend.avatar}</span>
                <span className="grow">{friend.name}</span>
                <ScoreBadge score={score} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
