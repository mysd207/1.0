import { FRIENDS, RESTAURANTS } from "../data/seed";
import type { Friend, Restaurant } from "./types";

const BY_ID = new Map(RESTAURANTS.map((r) => [r.id, r]));

export function getRestaurant(id: string): Restaurant {
  const r = BY_ID.get(id);
  if (!r) throw new Error(`Unknown restaurant ${id}`);
  return r;
}

export function getFriend(id: string): Friend | undefined {
  return FRIENDS.find((f) => f.id === id);
}

export function friendScores(
  restaurantId: string,
  following: string[],
): { friend: Friend; score: number; note?: string }[] {
  return FRIENDS.filter((f) => following.includes(f.id) && restaurantId in f.scores)
    .map((f) => ({ friend: f, score: f.scores[restaurantId], note: f.notes[restaurantId] }))
    .sort((a, b) => b.score - a.score);
}

export function friendAverage(restaurantId: string, following: string[]): number | undefined {
  const s = friendScores(restaurantId, following);
  if (s.length === 0) return undefined;
  return round1(s.reduce((sum, x) => sum + x.score, 0) / s.length);
}

/**
 * How closely a friend's taste matches yours, 0-100, from the places you've
 * both ranked. Undefined until there's some overlap.
 */
export function tasteMatch(mine: Record<string, number>, theirs: Record<string, number>): number | undefined {
  const shared = Object.keys(mine).filter((id) => id in theirs);
  if (shared.length === 0) return undefined;
  const avgDiff = shared.reduce((sum, id) => sum + Math.abs(mine[id] - theirs[id]), 0) / shared.length;
  return Math.max(0, Math.round(100 - avgDiff * 10));
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function priceLabel(price: number): string {
  return "$".repeat(price);
}

export function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function scoreTone(score: number): "good" | "ok" | "bad" {
  if (score >= 6.7) return "good";
  if (score >= 3.3) return "ok";
  return "bad";
}

const CUISINE_HUES: Record<string, number> = {
  Italian: 8, Japanese: 350, Mexican: 28, Chinese: 0, French: 220, Korean: 15, Thai: 140,
  Mediterranean: 190, Pizza: 20, American: 35, Indian: 40, Vietnamese: 120, Spanish: 12,
  Bakery: 38, Steakhouse: 5, Vegetarian: 100, Seafood: 200, Ethiopian: 30, Lebanese: 160,
  Dessert: 320, Diner: 45, Steak: 5,
};

/** Generated "cover photo" gradient, since the prototype has no real images. */
export function coverStyle(r: Restaurant): { background: string } {
  const h = CUISINE_HUES[r.cuisine] ?? (r.id.charCodeAt(1) * 47) % 360;
  return {
    background: `radial-gradient(circle at 25% 20%, hsl(${h} 90% 72%), transparent 55%),
      radial-gradient(circle at 80% 90%, hsl(${(h + 40) % 360} 80% 55%), transparent 60%),
      linear-gradient(135deg, hsl(${h} 70% 58%), hsl(${(h + 330) % 360} 65% 38%))`,
  };
}
