import type { ReactNode } from "react";
import { coverStyle, priceLabel, scoreTone } from "../lib/helpers";
import type { Restaurant } from "../lib/types";

export function ScoreBadge({ score, size = "md" }: { score?: number; size?: "sm" | "md" | "lg" | "xl" }) {
  if (score === undefined) return <span className={`score score-${size} score-empty`}>–</span>;
  return <span className={`score score-${size} score-${scoreTone(score)}`}>{score.toFixed(1)}</span>;
}

export function Thumb({ restaurant, size = 48 }: { restaurant: Restaurant; size?: number }) {
  return (
    <span className="thumb" style={{ ...coverStyle(restaurant), width: size, height: size, fontSize: size * 0.5 }}>
      {restaurant.emoji}
    </span>
  );
}

export function Cover({ restaurant, height = 200, children }: { restaurant: Restaurant; height?: number; children?: ReactNode }) {
  return (
    <div className="cover" style={{ ...coverStyle(restaurant), height }}>
      <span className="cover-emoji" style={{ fontSize: height * 0.42 }}>{restaurant.emoji}</span>
      {children}
    </div>
  );
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
      {rank !== undefined && <span className={`row-rank ${rank <= 3 ? "podium" : ""}`}>{rank}</span>}
      <Thumb restaurant={restaurant} />
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

export function Avatar({ emoji, size = 36 }: { emoji: string; size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.6 }}>
      {emoji}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon: string; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <span className="empty-icon">{icon}</span>
      <p className="empty-title">{title}</p>
      <p className="empty-body">{body}</p>
      {action}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="section-title">
      <h3>{children}</h3>
      {action}
    </div>
  );
}

export function TopBar({ onBack, title, right }: { onBack: () => void; title?: string; right?: ReactNode }) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={onBack} aria-label="Back">‹</button>
      <span className="topbar-title">{title}</span>
      <span className="topbar-right">{right}</span>
    </div>
  );
}
