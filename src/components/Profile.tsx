import { useState } from "react";
import { useApp } from "../context";
import { CALIBRATION_TARGET } from "../data/seed";
import { getRestaurant } from "../lib/helpers";
import { overallOrder } from "../lib/ranking";
import { Avatar, RestaurantRow, SectionTitle } from "./common";
import { CalibrationCard, FeedItem } from "./Feed";
import { Icon } from "./icons";
import { CountRow, ProfileBar, ProfileTabs, StatCard } from "./ProfileParts";
import { PickedForYou, TasteTwins, TraitsCard } from "./Taste";

type ProfileTab = "activity" | "taste" | "stats";

function GoalRing({ value, goal }: { value: number; goal: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / goal);
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" className="ring">
      <circle cx="64" cy="64" r={r} className="ring-track" />
      <circle cx="64" cy="64" r={r} className="ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 64 64)" />
      <text x="64" y="60" className="ring-num">{value}</text>
      <text x="64" y="80" className="ring-sub">of {goal}</text>
    </svg>
  );
}

/** Stand-in global rank that improves as you rank more places. */
function rankOnBeli(count: number): string {
  return count === 0 ? "–" : `#${(184_000 - count * 1_250).toLocaleString("en-US")}`;
}

export function Profile() {
  const { state, dispatch, goTab, toast } = useApp();
  const [tab, setTab] = useState<ProfileTab>("taste");
  const order = overallOrder(state.rankings);
  const count = order.length;
  const mine = state.activity.filter((a) => a.userId === "me").sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="view profile">
      <ProfileBar title="Your Profile" right={<button aria-label="Menu" onClick={() => toast("Settings aren't in this prototype")}><Icon.Menu size={28} /></button>} />

      <div className="profile-id">
        <Avatar emoji="🙂" size={112} />
        <p className="handle">@you</p>
        <p className="muted">Member since {state.memberSince}</p>
        {state.city && <span className="badge-pill"><Icon.Fork size={16} /> {state.city}</span>}
      </div>

      <div className="profile-stats">
        <div><strong>0</strong><span>Followers</span></div>
        <div><strong>{state.following.length}</strong><span>Following</span></div>
        <div><strong>{rankOnBeli(count)}</strong><span>Rank on Beli</span></div>
      </div>

      <div className="follow-row">
        <button className="btn" onClick={() => toast("Editing your profile isn't in this prototype")}>Edit profile</button>
        <button className="btn" onClick={() => toast("Sharing isn't in this prototype")}>Share profile</button>
      </div>

      <div className="count-rows">
        <CountRow icon={<Icon.CheckCircle size={30} />} label="Been" count={count} onClick={() => goTab("lists", "been")} />
        <CountRow icon={<Icon.Bookmark size={28} filled />} label="Want to Try" count={state.wantToTry.length} onClick={() => goTab("lists", "want")} />
        <CountRow icon={<Icon.Compass size={28} />} label="Recs for you" count="" onClick={() => goTab("lists", "recs")} />
      </div>

      <div className="stat-cards">
        <StatCard icon={<Icon.Trophy size={30} />} label="Rank on Beli" value={rankOnBeli(count)} />
        <StatCard icon={<Icon.Flame />} label="Current Streak" value={count > 0 ? "1 week" : "0 weeks"} />
      </div>

      <ProfileTabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "activity", label: "Activity", icon: <Icon.Feed size={20} /> },
          { id: "taste", label: "Taste Profile", icon: <Icon.Bars /> },
          { id: "stats", label: "Stats", icon: <Icon.Grid /> },
        ]}
      />

      {tab === "activity" &&
        (mine.length ? (
          <div className="feed-list">{mine.map((a) => <FeedItem key={a.id} activity={a} />)}</div>
        ) : (
          <p className="muted center-text pad">Rank or save a place and it'll show up here. Calibration rankings stay private.</p>
        ))}

      {tab === "taste" && (
        <div className="stack">
          {count < CALIBRATION_TARGET && <CalibrationCard />}
          {count > 0 && (
            <>
              <SectionTitle>What your rankings say</SectionTitle>
              <TraitsCard />
              <SectionTitle>People who eat like you</SectionTitle>
              <TasteTwins />
              <SectionTitle>Picked for you</SectionTitle>
              <PickedForYou />
            </>
          )}
          {count >= CALIBRATION_TARGET && (
            <button className="btn subtle" onClick={() => dispatch({ type: "restartOnboarding", entry: "redo" })}>
              Redo taste calibration
            </button>
          )}
        </div>
      )}

      {tab === "stats" && <Stats />}
    </div>
  );
}

function Stats() {
  const { state, dispatch, scores, push } = useApp();
  const order = overallOrder(state.rankings);
  const count = order.length;
  const cuisines = new Map<string, number>();
  const hoods = new Set<string>();
  for (const id of order) {
    const r = getRestaurant(id);
    cuisines.set(r.cuisine, (cuisines.get(r.cuisine) ?? 0) + 1);
    hoods.add(r.neighborhood);
  }
  const topCuisines = [...cuisines.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const avg = count ? Object.values(scores).reduce((a, b) => a + b, 0) / count : undefined;

  return (
    <div className="stack">
      <SectionTitle>{new Date().getFullYear()} goal</SectionTitle>
      <div className="card goal">
        <GoalRing value={count} goal={state.yearlyGoal} />
        <div className="grow">
          <p className="goal-text">{count >= state.yearlyGoal ? "Goal crushed! 🎉" : `${state.yearlyGoal - count} more restaurants to go`}</p>
          <div className="stepper">
            <button onClick={() => dispatch({ type: "setGoal", goal: state.yearlyGoal - 5 })}>−5</button>
            <span>Goal: {state.yearlyGoal}</span>
            <button onClick={() => dispatch({ type: "setGoal", goal: state.yearlyGoal + 5 })}>+5</button>
          </div>
        </div>
      </div>

      {count > 0 && (
        <>
          <div className="stat-row">
            <div className="stat"><span className="stat-num">{avg?.toFixed(1)}</span><span className="muted small">Avg score</span></div>
            <div className="stat"><span className="stat-num">{cuisines.size}</span><span className="muted small">Cuisines</span></div>
            <div className="stat"><span className="stat-num">{hoods.size}</span><span className="muted small">Neighborhoods</span></div>
          </div>
          <SectionTitle>Top cuisines</SectionTitle>
          <div className="card stack">
            {topCuisines.map(([c, n]) => (
              <div key={c} className="hbar">
                <span className="hbar-label">{c}</span>
                <span className="bar"><span style={{ width: `${(n / topCuisines[0][1]) * 100}%` }} /></span>
                <span className="hbar-val">{n}</span>
              </div>
            ))}
          </div>
          <SectionTitle>Your top 5</SectionTitle>
          <div className="stack">
            {order.slice(0, 5).map((id, i) => (
              <RestaurantRow key={id} restaurant={getRestaurant(id)} rank={i + 1} score={scores[id]} onClick={() => push({ kind: "restaurant", id })} />
            ))}
          </div>
        </>
      )}

      <button
        className="btn subtle"
        onClick={() => {
          if (confirm("Clear all your rankings, saves and follows?")) dispatch({ type: "reset" });
        }}
      >
        Reset demo data
      </button>
    </div>
  );
}
