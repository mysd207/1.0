import { useApp } from "../context";
import { getFriend, getRestaurant, tasteMatch } from "../lib/helpers";
import { Avatar, RestaurantRow, ScoreBadge, SectionTitle, TopBar } from "./common";

export function FriendPage({ friendId }: { friendId: string }) {
  const { state, dispatch, scores, push, back } = useApp();
  const friend = getFriend(friendId);
  if (!friend) return null;

  const following = state.following.includes(friend.id);
  const ranked = Object.entries(friend.scores).sort((a, b) => b[1] - a[1]);
  const match = tasteMatch(scores, friend.scores);
  const shared = ranked.filter(([id]) => id in scores).length;

  return (
    <div className="screen">
      <TopBar onBack={back} title={`@${friend.handle}`} />
      <div className="profile-head">
        <Avatar emoji={friend.avatar} size={84} />
        <h1 className="tight">{friend.name}</h1>
        <p className="muted">{friend.bio}</p>
        <button
          className={`btn ${following ? "" : "primary"} follow`}
          onClick={() => dispatch({ type: "toggleFollow", friendId: friend.id })}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>

      <div className="stat-row">
        <div className="stat"><span className="stat-num">{ranked.length}</span><span className="muted small">Been</span></div>
        <div className="stat"><span className="stat-num">{shared}</span><span className="muted small">In common</span></div>
        <div className="stat">
          <span className="stat-num match">{match === undefined ? "–" : `${match}%`}</span>
          <span className="muted small">Taste match</span>
        </div>
      </div>
      {match === undefined && (
        <p className="muted small center-text">Rank a place {friend.name.split(" ")[0]} has been to and we'll work out your taste match.</p>
      )}

      <SectionTitle>{friend.name.split(" ")[0]}'s list</SectionTitle>
      <div className="stack">
        {ranked.map(([id, score], i) => (
          <RestaurantRow
            key={id}
            restaurant={getRestaurant(id)}
            rank={i + 1}
            onClick={() => push({ kind: "restaurant", id })}
            subtitle={
              id in scores ? (
                <>You: <b>{scores[id].toFixed(1)}</b> · {getRestaurant(id).neighborhood}</>
              ) : undefined
            }
            trailing={<ScoreBadge score={score} />}
          />
        ))}
      </div>
    </div>
  );
}
