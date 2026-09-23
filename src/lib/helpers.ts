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

export function friendScores(restaurantId: string): { friend: Friend; score: number }[] {
  return FRIENDS.filter((f) => restaurantId in f.scores)
    .map((f) => ({ friend: f, score: f.scores[restaurantId] }))
    .sort((a, b) => b.score - a.score);
}

export function friendAverage(restaurantId: string): number | undefined {
  const s = friendScores(restaurantId);
  if (s.length === 0) return undefined;
  return Math.round((s.reduce((sum, x) => sum + x.score, 0) / s.length) * 10) / 10;
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
