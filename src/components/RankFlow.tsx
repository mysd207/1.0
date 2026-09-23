import { useState } from "react";
import { answer, isDone, maxComparisons, pivotIndex, startComparison, tie, type Comparison } from "../lib/ranking";
import { getRestaurant, priceLabel } from "../lib/helpers";
import type { Rankings, Sentiment } from "../lib/types";

type Step =
  | { kind: "sentiment" }
  | { kind: "compare"; sentiment: Sentiment; list: string[]; comparison: Comparison; asked: number };

const SENTIMENT_OPTIONS: { value: Sentiment; label: string; face: string }[] = [
  { value: "liked", label: "I liked it!", face: "😍" },
  { value: "fine", label: "It was fine", face: "😐" },
  { value: "disliked", label: "I didn't like it", face: "😣" },
];

export function RankFlow({
  restaurantId,
  rankings,
  initialNote,
  onDone,
  onCancel,
}: {
  restaurantId: string;
  rankings: Rankings;
  initialNote: string;
  onDone: (sentiment: Sentiment, index: number, note: string) => void;
  onCancel: () => void;
}) {
  const restaurant = getRestaurant(restaurantId);
  const [note, setNote] = useState(initialNote);
  const [step, setStep] = useState<Step>({ kind: "sentiment" });

  function chooseSentiment(sentiment: Sentiment) {
    // When re-ranking, compare only against the other places.
    const list = rankings[sentiment].filter((id) => id !== restaurantId);
    const comparison = startComparison(list.length);
    if (isDone(comparison)) {
      onDone(sentiment, 0, note);
      return;
    }
    setStep({ kind: "compare", sentiment, list, comparison, asked: 0 });
  }

  function advance(next: Comparison) {
    if (step.kind !== "compare") return;
    if (isDone(next)) {
      onDone(step.sentiment, next.lo, note);
      return;
    }
    setStep({ ...step, comparison: next, asked: step.asked + 1 });
  }

  return (
    <div className="flow">
      <div className="flow-head">
        <button className="link" onClick={onCancel}>Cancel</button>
      </div>

      {step.kind === "sentiment" && (
        <>
          <div className="flow-title">
            <span className="flow-emoji">{restaurant.emoji}</span>
            <h2>How was {restaurant.name}?</h2>
            <p className="muted">{restaurant.cuisine} · {priceLabel(restaurant.price)} · {restaurant.neighborhood}</p>
          </div>
          <div className="sentiments">
            {SENTIMENT_OPTIONS.map((o) => (
              <button key={o.value} className={`sentiment sentiment-${o.value}`} onClick={() => chooseSentiment(o.value)}>
                <span className="sentiment-face">{o.face}</span>
                {o.label}
              </button>
            ))}
          </div>
          <label className="note">
            <span className="muted">Notes (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you order? Would you go back?"
              rows={3}
            />
          </label>
        </>
      )}

      {step.kind === "compare" && (
        <CompareStep
          newId={restaurantId}
          otherId={step.list[pivotIndex(step.comparison)]}
          progress={`${step.asked + 1} of ≤${maxComparisons(step.list.length)}`}
          onPick={(newIsBetter) => advance(answer(step.comparison, newIsBetter))}
          onTie={() => advance(tie(step.comparison))}
        />
      )}
    </div>
  );
}

function CompareStep({
  newId,
  otherId,
  progress,
  onPick,
  onTie,
}: {
  newId: string;
  otherId: string;
  progress: string;
  onPick: (newIsBetter: boolean) => void;
  onTie: () => void;
}) {
  const a = getRestaurant(newId);
  const b = getRestaurant(otherId);
  return (
    <>
      <div className="flow-title">
        <h2>Which do you prefer?</h2>
        <p className="muted">Comparison {progress}</p>
      </div>
      <div className="versus">
        <button className="versus-card" onClick={() => onPick(true)}>
          <span className="flow-emoji">{a.emoji}</span>
          <strong>{a.name}</strong>
          <span className="muted">{a.cuisine}</span>
        </button>
        <span className="versus-or">or</span>
        <button className="versus-card" onClick={() => onPick(false)}>
          <span className="flow-emoji">{b.emoji}</span>
          <strong>{b.name}</strong>
          <span className="muted">{b.cuisine}</span>
        </button>
      </div>
      <button className="link center" onClick={onTie}>Too tough to decide</button>
    </>
  );
}
