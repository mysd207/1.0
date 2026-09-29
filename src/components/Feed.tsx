import type { ReactNode } from "react";
import { useApp } from "../context";
import { CALIBRATION_TARGET, FEATURED_LISTS, type FeaturedList } from "../data/seed";
import { coverStyle, getFriend, getRestaurant, timeAgo } from "../lib/helpers";
import type { Activity } from "../lib/types";
import { Avatar, ScoreBadge } from "./common";
import { Icon } from "./icons";

export function Feed() {
  const { state, goTab, toast } = useApp();
  const items = state.activity
    .filter((a) => a.userId === "me" || state.following.includes(a.userId))
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="view feed">
      <header className="appbar">
        <span className="wordmark">beli</span>
        <span className="appbar-icons">
          <button aria-label="Reservations" onClick={() => toast("Reservations aren't in this prototype")}><Icon.Calendar size={28} /></button>
          <button aria-label="Notifications" onClick={() => toast("No new notifications")}><Icon.Bell size={28} /></button>
          <button aria-label="Menu" onClick={() => toast("Menu isn't in this prototype")}><Icon.Menu size={28} /></button>
        </span>
      </header>

      <button className="searchbar" onClick={() => goTab("search")}>
        <Icon.Search size={22} />
        <span>Search a restaurant, member, etc.</span>
      </button>

      <div className="pills">
        <Pill icon={<Icon.Calendar size={18} />} onClick={() => toast("Reservations aren't in this prototype")}>Reserve now</Pill>
        <Pill icon={<Icon.Bag />} onClick={() => toast("Ordering isn't in this prototype")}>Order</Pill>
        <Pill icon={<Icon.Navigate />} onClick={() => goTab("lists", "recs")}>Recs Nearby</Pill>
        <Pill icon={<Icon.Trend />} onClick={() => goTab("search")}>Trending</Pill>
      </div>

      <CalibrationCard />

      <FeaturedLists />

      <h3 className="section-label">Your feed</h3>
      <button className="ask" onClick={() => toast("Asking friends isn't in this prototype")}>
        <Avatar emoji="🙂" size={48} />
        <span className="ask-input">Ask your friends for recs</span>
      </button>
      <div className="feed-list">
        {items.map((a) => <FeedItem key={a.id} activity={a} />)}
      </div>
    </div>
  );
}

function Pill({ icon, children, onClick }: { icon: ReactNode; children: ReactNode; onClick: () => void }) {
  return (
    <button className="pill-btn" onClick={onClick}>
      {icon}
      {children}
    </button>
  );
}

const UNLOCKS: { at: number; label: string; icon: ReactNode }[] = [
  { at: 1, label: "Match Scores", icon: <Icon.Target /> },
  { at: 2, label: "Taste Twins", icon: <Icon.Users /> },
  { at: 3, label: "Personal Recs", icon: <Icon.Compass /> },
  { at: 4, label: "Why You Match", icon: <Icon.Info /> },
  { at: 5, label: "Taste Profile", icon: <Icon.Bars size={30} /> },
];

/**
 * Nudges anyone with fewer than 5 ranked places back into calibration,
 * framed as features they unlock as they go.
 */
export function CalibrationCard() {
  const { scores, dispatch } = useApp();
  const count = Object.keys(scores).length;
  if (count >= CALIBRATION_TARGET) return null;
  const left = CALIBRATION_TARGET - count;

  return (
    <section className="unlock-card">
      <h2 className="unlock-title">
        {count === 0 ? "Calibrate your taste!" : `Rank ${left} more place${left === 1 ? "" : "s"} you know!`}
      </h2>
      <p className="muted">Unlock features as you calibrate ({count}/{CALIBRATION_TARGET})</p>
      <div className="unlock-row">
        {UNLOCKS.map((u) => {
          const done = count >= u.at;
          return (
            <div key={u.label} className={`unlock ${done ? "done" : ""}`}>
              <span className="unlock-tile">
                {done ? <span className="unlock-check"><Icon.Check size={26} /></span> : u.icon}
              </span>
              <span className="unlock-label">{u.label}</span>
            </div>
          );
        })}
      </div>
      <button className="btn primary wide" onClick={() => dispatch({ type: "restartOnboarding", entry: "resume" })}>
        {count === 0 ? "Start calibrating" : "Keep calibrating"}
      </button>
    </section>
  );
}

function FeaturedLists() {
  const { scores, push, toast } = useApp();
  return (
    <>
      <div className="section-head">
        <h3 className="section-label">Featured lists</h3>
        <button className="see-all" onClick={() => toast("Showing all featured lists below")}>See all</button>
      </div>
      <div className="carousel">
        {FEATURED_LISTS.map((l) => (
          <ListCard key={l.id} list={l} been={l.restaurantIds.filter((id) => id in scores).length} onClick={() => push({ kind: "list", id: l.id })} />
        ))}
      </div>
    </>
  );
}

function ListCard({ list, been, onClick }: { list: FeaturedList; been: number; onClick: () => void }) {
  const [a, b, c] = list.restaurantIds.map(getRestaurant);
  return (
    <button className="list-card" onClick={onClick} style={coverStyle(a)}>
      <span className="list-card-art" aria-hidden>
        {[a, b, c].filter(Boolean).map((r) => <span key={r.id}>{r.emoji}</span>)}
      </span>
      <span className="list-card-text">
        <strong>{list.title}</strong>
        <span>You've been to {been} of {list.restaurantIds.length}</span>
      </span>
    </button>
  );
}

export function FeedItem({ activity: a }: { activity: Activity }) {
  const { state, dispatch, scores, push, toast } = useApp();
  const r = getRestaurant(a.restaurantId);
  const friend = getFriend(a.userId);
  const isMe = a.userId === "me";
  const name = isMe ? "You" : friend?.name.split(" ")[0];
  const liked = state.likedActivity.includes(a.id);
  const likes = (a.likes ?? 0) + (liked ? 1 : 0);
  const saved = state.wantToTry.includes(r.id);
  const been = r.id in scores;

  return (
    <article className="feed-item">
      <div className="feed-head">
        <button onClick={() => friend && push({ kind: "friend", id: friend.id })} aria-label={name}>
          <Avatar emoji={isMe ? "🙂" : friend?.avatar ?? "👤"} size={60} />
        </button>
        <div className="grow">
          <p className="feed-title">
            <b>{name}</b> {a.kind === "ranked" ? "ranked" : "bookmarked"}{" "}
            <button className="feed-place" onClick={() => push({ kind: "restaurant", id: r.id })}>{r.name}</button>
          </p>
          <p className="feed-meta"><Icon.Fork /> · {r.neighborhood}, {r.city}</p>
          {a.kind === "ranked" && <p className="feed-meta"><Icon.Repeat /> 1 visit</p>}
        </div>
        {a.kind === "ranked" && <ScoreBadge score={a.score} />}
      </div>
      {a.note && <p className="feed-note"><b>Notes:</b> {a.note}</p>}
      <div className="feed-actions">
        <button className={liked ? "liked" : ""} onClick={() => !isMe && dispatch({ type: "toggleLike", activityId: a.id })} aria-label="Like">
          <Icon.Heart size={28} filled={liked} />
          {likes > 0 && <span className="count-sm">{likes}</span>}
        </button>
        <button onClick={() => toast("Comments aren't in this prototype")} aria-label="Comment"><Icon.Comment size={28} /></button>
        <button onClick={() => toast("Sharing isn't in this prototype")} aria-label="Share"><Icon.Send size={27} /></button>
        <span className="grow" />
        <button onClick={() => push({ kind: "rank", id: r.id })} aria-label={been ? "Re-rank" : "Rank"}><Icon.PlusCircle size={30} /></button>
        <button
          className={saved ? "saved" : ""}
          disabled={been}
          onClick={() => dispatch({ type: "toggleWantToTry", restaurantId: r.id })}
          aria-label="Want to try"
        >
          <Icon.Bookmark size={28} filled={saved} />
        </button>
      </div>
      <p className="feed-time">{timeAgo(a.at, true)}</p>
    </article>
  );
}
