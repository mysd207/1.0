import { useApp } from "../context";
import { getRestaurant } from "../lib/helpers";
import { overallOrder } from "../lib/ranking";
import { Avatar, RestaurantRow, SectionTitle } from "./common";

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

export function Profile() {
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
    <div className="view">
      <div className="profile-head">
        <Avatar emoji="🙂" size={84} />
        <h1 className="tight">You</h1>
        <p className="muted">@you · New York</p>
      </div>

      <div className="stat-row">
        <div className="stat"><span className="stat-num">{count}</span><span className="muted small">Been</span></div>
        <div className="stat"><span className="stat-num">{state.wantToTry.length}</span><span className="muted small">Want to try</span></div>
        <div className="stat"><span className="stat-num">{state.following.length}</span><span className="muted small">Following</span></div>
      </div>

      <SectionTitle>{new Date().getFullYear()} goal</SectionTitle>
      <div className="card goal">
        <GoalRing value={count} goal={state.yearlyGoal} />
        <div className="grow">
          <p className="goal-text">
            {count >= state.yearlyGoal ? "Goal crushed! 🎉" : `${state.yearlyGoal - count} more restaurants to go`}
          </p>
          <div className="stepper">
            <button onClick={() => dispatch({ type: "setGoal", goal: state.yearlyGoal - 5 })}>−5</button>
            <span>Goal: {state.yearlyGoal}</span>
            <button onClick={() => dispatch({ type: "setGoal", goal: state.yearlyGoal + 5 })}>+5</button>
          </div>
        </div>
      </div>

      {count > 0 && (
        <>
          <SectionTitle>Your stats</SectionTitle>
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
