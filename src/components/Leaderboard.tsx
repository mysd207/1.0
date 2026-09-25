import { useState } from "react";
import { useApp } from "../context";
import { FRIENDS } from "../data/seed";
import { tasteMatch } from "../lib/helpers";
import { Avatar } from "./common";

type Board = "count" | "match";

export function Leaderboard() {
  const { state, scores, push } = useApp();
  const [board, setBoard] = useState<Board>("count");
  const people = FRIENDS.filter((f) => state.following.includes(f.id));

  const rows =
    board === "count"
      ? [
          { id: "me", name: "You", avatar: "🙂", value: Object.keys(scores).length, label: "places" },
          ...people.map((f) => ({ id: f.id, name: f.name, avatar: f.avatar, value: Object.keys(f.scores).length, label: "places" })),
        ].sort((a, b) => b.value - a.value)
      : people
          .map((f) => ({ id: f.id, name: f.name, avatar: f.avatar, value: tasteMatch(scores, f.scores) ?? -1, label: "%" }))
          .sort((a, b) => b.value - a.value);

  const max = Math.max(1, ...rows.map((r) => r.value));
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="view">
      <h1>Leaderboard</h1>
      <div className="segmented">
        <button className={board === "count" ? "on" : ""} onClick={() => setBoard("count")}>Most places</button>
        <button className={board === "match" ? "on" : ""} onClick={() => setBoard("match")}>Taste match</button>
      </div>
      <p className="muted small">
        {board === "count"
          ? "Who's been to the most restaurants among you and the people you follow."
          : "Whose taste lines up with yours, based on places you've both ranked."}
      </p>
      {rows.map((row, i) => (
        <button
          key={row.id}
          className={`row ${row.id === "me" ? "me" : ""}`}
          onClick={() => row.id !== "me" && push({ kind: "friend", id: row.id })}
        >
          <span className="row-rank">{row.value >= 0 && i < 3 ? medals[i] : i + 1}</span>
          <Avatar emoji={row.avatar} />
          <span className="row-body">
            <span className="row-title">{row.name}</span>
            <span className="bar"><span style={{ width: `${Math.max(0, (row.value / max) * 100)}%` }} /></span>
          </span>
          <span className="count">{row.value < 0 ? "–" : `${row.value}${row.label === "%" ? "%" : ""}`}</span>
        </button>
      ))}
      {board === "match" && Object.keys(scores).length === 0 && (
        <p className="muted small center-text">Rank a few places to see your taste matches.</p>
      )}
    </div>
  );
}
