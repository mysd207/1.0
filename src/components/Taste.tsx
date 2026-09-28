import { useApp } from "../context";
import { getRestaurant } from "../lib/helpers";
import { friendMatches, matchReason, personalizedRecs, tasteTraits } from "../lib/taste";
import { Avatar, RestaurantRow } from "./common";

/** What your rankings say about you, in plain language. */
export function TraitsCard() {
  const { scores } = useApp();
  const traits = tasteTraits(scores);
  if (!traits) return null;
  return (
    <div className="card traits">
      <div className="trait">
        <span className="trait-icon">🍴</span>
        <span className="grow">
          <span className="muted small block">You gravitate to</span>
          <strong>{traits.favoriteCuisines.join(", ")}</strong>
        </span>
      </div>
      <div className="trait">
        <span className="trait-icon">{traits.priceEmoji}</span>
        <span className="grow">
          <span className="muted small block">Price sweet spot</span>
          <strong>{traits.priceLabel}</strong>
        </span>
      </div>
      {traits.vibe && (
        <div className="trait">
          <span className="trait-icon">✨</span>
          <span className="grow">
            <span className="muted small block">Your vibe</span>
            <strong>{traits.vibe}</strong>
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * People whose taste lines up with yours, each with the reason why, so the
 * match % is never a black box.
 */
export function TasteTwins({
  limit = 3,
  selected,
  onToggle,
}: {
  limit?: number;
  /** When provided, shows follow toggles backed by this local selection. */
  selected?: string[];
  onToggle?: (friendId: string) => void;
}) {
  const { state, dispatch, scores, push } = useApp();
  const matches = friendMatches(scores).slice(0, limit);
  if (matches.length === 0) return <p className="muted small">Rank a few more places to find people who eat like you.</p>;

  return (
    <div className="stack">
      {matches.map((m) => {
        const following = state.following.includes(m.friend.id);
        const on = following || selected?.includes(m.friend.id);
        return (
          <div key={m.friend.id} className="twin">
            <button className="twin-main" onClick={() => !selected && push({ kind: "friend", id: m.friend.id })}>
              <Avatar emoji={m.friend.avatar} size={44} />
              <span className="grow">
                <strong>{m.friend.name}</strong>
                <span className="muted small block">{matchReason(m)}</span>
              </span>
              <span className="match-pct">{m.match}%</span>
            </button>
            {!following && (
              <button
                className={`chip ${on ? "on" : ""}`}
                onClick={() => (onToggle ? onToggle(m.friend.id) : dispatch({ type: "toggleFollow", friendId: m.friend.id }))}
              >
                {on ? "✓ Following" : "+ Follow"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Restaurants predicted for you, with the person whose taste backs each pick. */
export function PickedForYou({ limit = 3 }: { limit?: number }) {
  const { state, scores, push } = useApp();
  const recs = personalizedRecs(scores, state.following, limit);
  return (
    <div className="stack">
      {recs.map((rec) => {
        const r = getRestaurant(rec.restaurantId);
        return (
          <RestaurantRow
            key={r.id}
            restaurant={r}
            score={rec.predicted}
            onClick={() => push({ kind: "restaurant", id: r.id })}
            subtitle={
              rec.because
                ? `${rec.because.friend.avatar} ${rec.because.friend.name.split(" ")[0]} (${rec.because.match}% match) gave it ${rec.because.score.toFixed(1)}`
                : `${r.cuisine} · ${r.neighborhood}`
            }
          />
        );
      })}
    </div>
  );
}
