import { useState } from "react";
import { useApp } from "../context";
import { formatMatch, getFriend, getRestaurant, tasteMatch } from "../lib/helpers";
import { friendMatches, tasteTraits } from "../lib/taste";
import type { Friend } from "../lib/types";
import { Avatar, RestaurantRow, ScoreBadge, Thumb } from "./common";
import { FeedItem } from "./Feed";
import { Icon } from "./icons";
import { CountRow, ProfileBar, ProfileTabs, StatCard } from "./ProfileParts";

export type FriendTab = "activity" | "taste" | "lists";

export function FriendPage({ friendId, initialTab = "activity" }: { friendId: string; initialTab?: FriendTab }) {
  const { state, dispatch, scores, back, toast } = useApp();
  const [tab, setTab] = useState<FriendTab>(initialTab);
  const friend = getFriend(friendId);
  if (!friend) return null;

  const following = state.following.includes(friend.id);
  const match = tasteMatch(scores, friend.scores);
  const shared = Object.keys(friend.scores).filter((id) => id in scores).length;
  const activity = state.activity.filter((a) => a.userId === friend.id).sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="screen profile">
      <ProfileBar
        title={friend.name}
        onBack={back}
        right={
          <>
            <button aria-label="Notifications" onClick={() => toast(`You'll be notified when ${friend.name.split(" ")[0]} posts`)}><Icon.Bell size={28} /></button>
            <button aria-label="More" onClick={() => toast("More options aren't in this prototype")}><Icon.Dots size={28} /></button>
          </>
        }
      />

      <div className="profile-id">
        <Avatar emoji={friend.avatar} size={112} />
        <p className="handle">@{friend.handle}</p>
        <p className="muted">Member since {friend.memberSince}</p>
        <button className="match-line" onClick={() => setTab("taste")}>
          {match === undefined ? (
            <span className="muted">No places in common yet</span>
          ) : (
            <>
              <span className="match-green">{formatMatch(match)} Match</span> · <b>{shared} {shared === 1 ? "Place" : "Places"} in Common</b>
            </>
          )}
        </button>
        <p>{friend.bio}</p>
        {friend.badge && <span className="badge-pill"><Icon.Fork size={16} /> {friend.badge}</span>}
      </div>

      <div className="profile-stats">
        <div><strong>{friend.followers + (following ? 1 : 0)}</strong><span>Followers</span></div>
        <div><strong>{friend.followingCount}</strong><span>Following</span></div>
        <div><strong>#{friend.rankOnBeli}</strong><span>Rank on Beli</span></div>
      </div>

      <div className="follow-row">
        <button className={`btn ${following ? "" : "primary"}`} onClick={() => dispatch({ type: "toggleFollow", friendId: friend.id })}>
          {following ? "Following" : "Follow"}
        </button>
        <button className="btn square" aria-label="Follow options" onClick={() => toast("Follow options aren't in this prototype")}><Icon.Caret /></button>
      </div>

      <div className="count-rows">
        <CountRow icon={<Icon.CheckCircle size={30} />} label="Been" count={Object.keys(friend.scores).length} onClick={() => setTab("lists")} />
        <CountRow icon={<Icon.Bookmark size={28} filled />} label="Want to Try" count={friend.wantToTryCount} onClick={() => toast("Their Want to Try list isn't in this prototype")} />
        <CountRow icon={<Icon.Users size={28} />} label="Places you've both been" count={shared} onClick={() => setTab("taste")} />
      </div>

      <div className="stat-cards">
        <StatCard icon={<Icon.Trophy size={30} />} label="Rank on Beli" value={`#${friend.rankOnBeli}`} />
        <StatCard icon={<Icon.Flame />} label="Current Streak" value={`${friend.streakWeeks} weeks`} />
      </div>

      <ProfileTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "activity", label: "Activity", icon: <Icon.Feed size={20} /> },
          { id: "taste", label: "Taste Profile", icon: <Icon.Bars /> },
          { id: "lists", label: "Lists", icon: <Icon.Grid /> },
        ]}
      />

      {tab === "activity" &&
        (activity.length ? (
          <div className="feed-list">{activity.map((a) => <FeedItem key={a.id} activity={a} />)}</div>
        ) : (
          <p className="muted center-text pad">No recent activity.</p>
        ))}
      {tab === "taste" && <TasteCompare friend={friend} />}
      {tab === "lists" && <FriendList friend={friend} />}
    </div>
  );
}

/**
 * The "why" behind a match: every place you've both ranked, split into where
 * you agree and where you differ, with both scores side by side.
 */
function TasteCompare({ friend }: { friend: Friend }) {
  const { scores, push } = useApp();
  const first = friend.name.split(" ")[0];
  const m = friendMatches(scores, [friend])[0];
  const theirTraits = tasteTraits(friend.scores);

  if (!m) {
    const theirTop = Object.entries(friend.scores).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return (
      <div className="taste-compare">
        <div className="explain">
          <strong>No match score yet</strong>
          <p className="muted small">Your match with {first} is based on places you've both ranked. Rank one of these to get started:</p>
        </div>
        <div className="stack">
          {theirTop.map(([id, s]) => (
            <RestaurantRow key={id} restaurant={getRestaurant(id)} onClick={() => push({ kind: "rank", id })} trailing={<ScoreBadge score={s} />} />
          ))}
        </div>
      </div>
    );
  }

  const shared = Object.keys(scores).filter((id) => id in friend.scores);
  const avgGap = shared.reduce((s, id) => s + Math.abs(scores[id] - friend.scores[id]), 0) / shared.length;
  const middle = shared.filter((id) => !m.agreements.includes(id) && !m.disagreements.includes(id));

  return (
    <div className="taste-compare">
      <div className="explain">
        <span className="match-big">{formatMatch(m.match)}</span>
        <span className="muted small">
          Based on {shared.length} {shared.length === 1 ? "place" : "places"} you've both ranked. Your scores are {avgGap.toFixed(1)} points apart on average.
          {shared.length < 5 && " Rank more places in common to make this more accurate."}
        </span>
      </div>

      <CompareGroup title="Where you agree" ids={m.agreements} friend={friend} />
      <CompareGroup title="Close enough" ids={middle} friend={friend} />
      <CompareGroup title="Where you differ" ids={m.disagreements} friend={friend} />

      {theirTraits && (
        <>
          <h3 className="section-label">{first}'s taste</h3>
          <p>
            Loves <b>{theirTraits.favoriteCuisines.join(", ")}</b> · {theirTraits.priceEmoji} {theirTraits.priceLabel}
          </p>
        </>
      )}
    </div>
  );
}

function CompareGroup({ title, ids, friend }: { title: string; ids: string[]; friend: Friend }) {
  const { scores, push } = useApp();
  if (ids.length === 0) return null;
  const first = friend.name.split(" ")[0];
  return (
    <>
      <h3 className="section-label">{title}</h3>
      <div className="stack">
        {ids.map((id) => {
          const r = getRestaurant(id);
          return (
            <button key={id} className="compare-row" onClick={() => push({ kind: "restaurant", id })}>
              <Thumb restaurant={r} size={44} />
              <span className="grow"><strong>{r.name}</strong><span className="muted small block">{r.cuisine}</span></span>
              <span className="duo">
                <span><ScoreBadge score={scores[id]} size="sm" /><small>You</small></span>
                <span><ScoreBadge score={friend.scores[id]} size="sm" /><small>{first}</small></span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function FriendList({ friend }: { friend: Friend }) {
  const { scores, push } = useApp();
  const ranked = Object.entries(friend.scores).sort((a, b) => b[1] - a[1]);
  return (
    <div className="stack">
      {ranked.map(([id, score], i) => (
        <RestaurantRow
          key={id}
          restaurant={getRestaurant(id)}
          rank={i + 1}
          onClick={() => push({ kind: "restaurant", id })}
          subtitle={id in scores ? <>You: <b>{scores[id].toFixed(1)}</b> · {getRestaurant(id).neighborhood}</> : undefined}
          trailing={<ScoreBadge score={score} />}
        />
      ))}
    </div>
  );
}
