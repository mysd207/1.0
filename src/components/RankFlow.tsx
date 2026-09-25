import { useState } from "react";
import { useApp } from "../context";
import { QUICK_TAGS } from "../data/seed";
import { getRestaurant, priceLabel } from "../lib/helpers";
import { answer, isDone, maxComparisons, pivotIndex, startComparison, tie, type Comparison } from "../lib/ranking";
import type { Sentiment } from "../lib/types";
import { Cover, TopBar } from "./common";

type Step =
  | { kind: "sentiment" }
  | { kind: "compare"; sentiment: Sentiment; list: string[]; comparison: Comparison; asked: number };

const SENTIMENT_OPTIONS: { value: Sentiment; label: string; face: string }[] = [
  { value: "liked", label: "I liked it!", face: "😍" },
  { value: "fine", label: "It was fine", face: "😐" },
  { value: "disliked", label: "I didn't like it", face: "😣" },
];

export function RankFlow({ restaurantId }: { restaurantId: string }) {
  const { state, dispatch, scores, replace, back } = useApp();
  const restaurant = getRestaurant(restaurantId);
  const previous = state.visits[restaurantId];
  const [note, setNote] = useState(previous?.note ?? "");
  const [tags, setTags] = useState<string[]>(previous?.tags ?? []);
  const [step, setStep] = useState<Step>({ kind: "sentiment" });

  function finish(sentiment: Sentiment, index: number) {
    const previousScore = scores[restaurantId];
    dispatch({ type: "rank", restaurantId, sentiment, index, note: note.trim(), tags });
    replace({ kind: "result", id: restaurantId, previousScore });
  }

  function chooseSentiment(sentiment: Sentiment) {
    // When re-ranking, compare only against the other places.
    const list = state.rankings[sentiment].filter((id) => id !== restaurantId);
    const comparison = startComparison(list.length);
    if (isDone(comparison)) return finish(sentiment, 0);
    setStep({ kind: "compare", sentiment, list, comparison, asked: 0 });
  }

  function advance(next: Comparison) {
    if (step.kind !== "compare") return;
    if (isDone(next)) return finish(step.sentiment, next.lo);
    setStep({ ...step, comparison: next, asked: step.asked + 1 });
  }

  function toggleTag(t: string) {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  if (step.kind === "compare") {
    const other = getRestaurant(step.list[pivotIndex(step.comparison)]);
    const total = maxComparisons(step.list.length);
    return (
      <div className="screen">
        <TopBar onBack={() => setStep({ kind: "sentiment" })} title={`Ranking ${restaurant.name}`} />
        <div className="progress"><span style={{ width: `${((step.asked + 1) / total) * 100}%` }} /></div>
        <div className="flow-title">
          <h2>Which do you prefer?</h2>
          <p className="muted">Tap the one you liked more</p>
        </div>
        <div className="versus">
          {[restaurant, other].map((r, i) => (
            <button key={r.id} className="versus-card" onClick={() => advance(answer(step.comparison, i === 0))}>
              <Cover restaurant={r} height={120} />
              <span className="versus-text">
                <strong>{r.name}</strong>
                <span className="muted small">{r.cuisine} · {r.neighborhood}</span>
                {i === 1 && <span className="pill">Your score: {scores[r.id]?.toFixed(1)}</span>}
                {i === 0 && <span className="pill new">New</span>}
              </span>
            </button>
          ))}
          <span className="versus-or">VS</span>
        </div>
        <button className="link center" onClick={() => advance(tie(step.comparison))}>Too tough to decide</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <TopBar onBack={back} title={previous ? "Re-rank" : "Add to your list"} />
      <div className="rank-hero">
        <Cover restaurant={restaurant} height={140} />
        <h2>How was {restaurant.name}?</h2>
        <p className="muted small">{restaurant.cuisine} · {priceLabel(restaurant.price)} · {restaurant.neighborhood}</p>
      </div>
      <div className="sentiments">
        {SENTIMENT_OPTIONS.map((o) => (
          <button key={o.value} className={`sentiment sentiment-${o.value}`} onClick={() => chooseSentiment(o.value)}>
            <span className="sentiment-face">{o.face}</span>
            <span className="grow">{o.label}</span>
            <span className="muted">›</span>
          </button>
        ))}
      </div>
      <p className="muted small label">Tags</p>
      <div className="chips">
        {QUICK_TAGS.map((t) => (
          <button key={t} className={`chip ${tags.includes(t) ? "on" : ""}`} onClick={() => toggleTag(t)}>{t}</button>
        ))}
      </div>
      <label className="note">
        <span className="muted small label">Notes</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="What did you order? Would you go back?" rows={3} />
      </label>
    </div>
  );
}

export function RankResult({ restaurantId, previousScore }: { restaurantId: string; previousScore?: number }) {
  const { scores, state, replace } = useApp();
  const r = getRestaurant(restaurantId);
  const score = scores[restaurantId];
  const order = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const position = order.findIndex(([id]) => id === restaurantId) + 1;
  const count = Object.keys(scores).length;
  const goal = state.yearlyGoal;

  return (
    <div className="screen result">
      <div className="confetti" aria-hidden>
        {Array.from({ length: 18 }, (_, i) => <span key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i % 6) * 0.12}s` }} />)}
      </div>
      <Cover restaurant={r} height={180}>
        <span className="result-score">{score?.toFixed(1)}</span>
      </Cover>
      <h2>{previousScore === undefined ? "Added to your list!" : "Re-ranked!"}</h2>
      <p className="lead">
        <strong>{r.name}</strong> is <strong>#{position}</strong> of the {count} {count === 1 ? "place" : "places"} you've ranked.
      </p>
      {previousScore !== undefined && previousScore !== score && (
        <p className="muted">
          {previousScore.toFixed(1)} → {score?.toFixed(1)} {score > previousScore ? "📈" : "📉"}
        </p>
      )}
      <div className="goal-inline">
        <div className="progress"><span style={{ width: `${Math.min(100, (count / goal) * 100)}%` }} /></div>
        <span className="muted small">{count} / {goal} toward your {new Date().getFullYear()} goal</span>
      </div>
      <button className="btn primary wide" onClick={() => replace({ kind: "restaurant", id: restaurantId })}>Done</button>
    </div>
  );
}
