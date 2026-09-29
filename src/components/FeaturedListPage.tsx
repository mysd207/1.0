import { useApp } from "../context";
import { CALIBRATION_TARGET, FEATURED_LISTS } from "../data/seed";
import { coverStyle, friendAverage, getRestaurant, priceLabel } from "../lib/helpers";
import { RestaurantRow, ScoreBadge } from "./common";
import { Icon } from "./icons";

export function FeaturedListPage({ listId }: { listId: string }) {
  const { state, scores, dispatch, push, back } = useApp();
  const list = FEATURED_LISTS.find((l) => l.id === listId);
  if (!list) return null;

  const ids = list.restaurantIds;
  const been = ids.filter((id) => id in scores).length;
  const calibrating = list.id === "recognized";
  const ranked = Object.keys(scores).length;

  return (
    <div className="screen flush">
      <div className="list-hero" style={coverStyle(getRestaurant(ids[0]))}>
        <button className="icon-btn floating" onClick={back} aria-label="Back"><Icon.Back size={24} /></button>
        <span className="list-hero-art" aria-hidden>{ids.slice(0, 5).map((id) => <span key={id}>{getRestaurant(id).emoji}</span>)}</span>
        <div className="list-hero-text">
          <h1 className="tight">{list.title}</h1>
          <span>You've been to {been} of {ids.length}</span>
        </div>
      </div>
      <div className="page-body">
        <p className="blurb">{list.blurb}</p>
        <div className="progress"><span style={{ width: `${(been / ids.length) * 100}%` }} /></div>

        {calibrating && (
          <div className="callout">
            <strong>{ranked >= CALIBRATION_TARGET ? "Your taste is calibrated" : `Rank ${CALIBRATION_TARGET - ranked} more to calibrate your taste`}</strong>
            <p className="muted small">
              Everyone knows these places, so they're the fastest way to find people whose taste matches yours.
            </p>
            <button
              className="btn primary"
              onClick={() => dispatch({ type: "restartOnboarding", entry: ranked >= CALIBRATION_TARGET ? "redo" : "resume" })}
            >
              {ranked >= CALIBRATION_TARGET ? "Recalibrate with this list" : "Calibrate with this list"}
            </button>
          </div>
        )}

        <div className="stack">
          {ids.map((id, i) => {
            const r = getRestaurant(id);
            const mine = scores[id];
            const avg = friendAverage(id, state.following);
            return (
              <RestaurantRow
                key={id}
                restaurant={r}
                rank={i + 1}
                onClick={() => push({ kind: "restaurant", id })}
                subtitle={`${r.cuisine} · ${priceLabel(r.price)} · ${r.neighborhood}${avg !== undefined ? ` · friends ${avg.toFixed(1)}` : ""}`}
                trailing={
                  mine !== undefined ? (
                    <ScoreBadge score={mine} />
                  ) : (
                    <span
                      className="row-add"
                      role="button"
                      aria-label={`Rank ${r.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        push({ kind: "rank", id });
                      }}
                    >
                      <Icon.PlusCircle size={30} />
                    </span>
                  )
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
