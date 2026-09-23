import type { ReactNode } from "react";
import { priceLabel, scoreTone } from "../lib/helpers";
import type { Restaurant } from "../lib/types";

export function ScoreBadge({ score, size = "md" }: { score?: number; size?: "md" | "lg" }) {
  if (score === undefined) return <span className={`score score-${size} score-empty`}>–</span>;
  return <span className={`score score-${size} score-${scoreTone(score)}`}>{score.toFixed(1)}</span>;
}

export function RestaurantRow({
  restaurant,
  rank,
  score,
  subtitle,
  onClick,
  trailing,
}: {
  restaurant: Restaurant;
  rank?: number;
  score?: number;
  subtitle?: ReactNode;
  onClick: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button className="row" onClick={onClick}>
      {rank !== undefined && <span className="row-rank">{rank}</span>}
      <span className="row-emoji">{restaurant.emoji}</span>
      <span className="row-body">
        <span className="row-title">{restaurant.name}</span>
        <span className="row-sub">
          {subtitle ?? `${restaurant.cuisine} · ${priceLabel(restaurant.price)} · ${restaurant.neighborhood}`}
        </span>
      </span>
      {trailing ?? (score !== undefined && <ScoreBadge score={score} />)}
    </button>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty">
      <p className="empty-title">{title}</p>
      <p className="empty-body">{body}</p>
    </div>
  );
}
