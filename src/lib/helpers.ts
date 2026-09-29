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
 *
 * Agreement drops 10 points per point of average disagreement, then is pulled
 * toward 50 when there's little evidence: one shared place can't make a 99%
 * match, but five that line up get close.
 */
export function tasteMatch(mine: Record<string, number>, theirs: Record<string, number>): number | undefined {
  const shared = Object.keys(mine).filter((id) => id in theirs);
  if (shared.length === 0) return undefined;
  const avgDiff = shared.reduce((sum, id) => sum + Math.abs(mine[id] - theirs[id]), 0) / shared.length;
  const raw = Math.max(0, 100 - avgDiff * 10);
  const confidence = shared.length / (shared.length + 1);
  return Math.round(50 + (raw - 50) * confidence);
}

/** Match shown the way the app does: relative to a neutral 50, e.g. 88 -> "+38%". */
export function formatMatch(match: number): string {
  const d = match - 50;
  return `${d >= 0 ? "+" : "−"}${Math.abs(d)}%`;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function priceLabel(price: number): string {
  return "$".repeat(price);
}

export function timeAgo(iso: string, long = false): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  const unit = (n: number, short: string, word: string) => (long ? `${n} ${word}${n === 1 ? "" : "s"} ago` : `${n}${short}`);
  if (mins < 1) return "just now";
  if (mins < 60) return unit(mins, "m", "minute");
  const hours = Math.round(mins / 60);
  if (hours < 24) return unit(hours, "h", "hour");
  return unit(Math.round(hours / 24), "d", "day");
}

export function scoreTone(score: number): "good" | "ok" | "bad" {
  if (score >= 6.7) return "good";
  if (score >= 3.3) return "ok";
  return "bad";
}

// A small, muted, food-editorial palette instead of generated rainbow gradients.
const PALETTE = {
  terracotta: "#b65a3c",
  tomato: "#b8412f",
  saffron: "#c98a2b",
  mustard: "#cfa54a",
  olive: "#7a8243",
  sage: "#8ea487",
  forest: "#2f5a48",
  teal: "#2c6a70",
  ink: "#223a4c",
  plum: "#6d3b55",
  blush: "#d99a86",
  cocoa: "#6a4636",
  tan: "#b99470",
};

const CUISINE_COLORS: Record<string, string> = {
  Italian: PALETTE.terracotta, Japanese: PALETTE.ink, Mexican: PALETTE.saffron, Chinese: PALETTE.tomato,
  French: PALETTE.plum, Korean: PALETTE.cocoa, Thai: PALETTE.olive, Mediterranean: PALETTE.sage,
  Pizza: PALETTE.tomato, American: PALETTE.mustard, Indian: PALETTE.saffron, Vietnamese: PALETTE.forest,
  Spanish: PALETTE.terracotta, Bakery: PALETTE.blush, Steakhouse: PALETTE.cocoa, Vegetarian: PALETTE.sage,
  Seafood: PALETTE.teal, Ethiopian: PALETTE.saffron, Lebanese: PALETTE.olive, Dessert: PALETTE.blush,
  Diner: PALETTE.mustard, Deli: PALETTE.tan, "Middle Eastern": PALETTE.olive,
};

/** Cover "photo" for a restaurant: a muted color field with soft light, since the prototype has no real images. */
export function coverStyle(r: Restaurant): { background: string } {
  const base = CUISINE_COLORS[r.cuisine] ?? PALETTE.teal;
  return {
    background: `radial-gradient(120% 90% at 18% 8%, rgb(255 255 255 / 0.22), transparent 55%),
      radial-gradient(90% 80% at 100% 100%, rgb(0 0 0 / 0.18), transparent 60%), ${base}`,
  };
}
