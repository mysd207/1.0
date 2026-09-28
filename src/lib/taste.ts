import { FRIENDS, RESTAURANTS } from "../data/seed";
import { getRestaurant, round1, tasteMatch } from "./helpers";
import type { Friend } from "./types";

type Scores = Record<string, number>;

export interface FriendMatch {
  friend: Friend;
  match: number;
  /** Places you both ranked within 1.5 points of each other, best first. */
  agreements: string[];
  /** Places where you're 3+ points apart. */
  disagreements: string[];
}

/** People ranked by how well their taste lines up with yours, with the evidence. */
export function friendMatches(mine: Scores, friends: Friend[] = FRIENDS): FriendMatch[] {
  const out: FriendMatch[] = [];
  for (const friend of friends) {
    const match = tasteMatch(mine, friend.scores);
    if (match === undefined) continue;
    const shared = Object.keys(mine).filter((id) => id in friend.scores);
    out.push({
      friend,
      match,
      agreements: shared
        .filter((id) => Math.abs(mine[id] - friend.scores[id]) <= 1.5)
        .sort((a, b) => mine[b] - mine[a]),
      disagreements: shared.filter((id) => Math.abs(mine[id] - friend.scores[id]) >= 3),
    });
  }
  return out.sort((a, b) => b.match - a.match || b.agreements.length - a.agreements.length);
}

/** One-line, human explanation of a match: the "why" behind the number. */
export function matchReason(m: FriendMatch): string {
  const first = m.friend.name.split(" ")[0];
  const names = m.agreements.slice(0, 2).map((id) => getRestaurant(id).name);
  if (names.length === 0) {
    const d = m.disagreements[0];
    return d ? `You and ${first} disagree on ${getRestaurant(d).name}` : `You've ranked some of the same places`;
  }
  const verb = m.agreements.some((id) => (m.friend.scores[id] ?? 0) >= 6.7) ? "rate" : "feel the same about";
  return `You both ${verb} ${names.join(" and ")} about the same`;
}

export interface Rec {
  restaurantId: string;
  predicted: number;
  /** The best-matched person who backs this pick. */
  because?: { friend: Friend; match: number; score: number };
}

/**
 * Predict your score for places you haven't ranked by weighting each person's
 * score by how well their taste matches yours. With no matches yet, this falls
 * back to a plain average of the people you follow.
 */
export function personalizedRecs(mine: Scores, following: string[], limit = 20): Rec[] {
  const matches = friendMatches(mine);
  const weight = new Map(matches.map((m) => [m.friend.id, m.match / 100]));
  const pool = FRIENDS.filter((f) => following.includes(f.id) || (weight.get(f.id) ?? 0) >= 0.7);

  const recs: Rec[] = [];
  for (const r of RESTAURANTS) {
    if (r.id in mine) continue;
    const raters = pool.filter((f) => r.id in f.scores);
    if (raters.length === 0) continue;
    let total = 0;
    let wsum = 0;
    for (const f of raters) {
      const w = matches.length ? (weight.get(f.id) ?? 0.3) ** 2 : 1;
      total += f.scores[r.id] * w;
      wsum += w;
    }
    // Credit the person pulling the prediction up the most: strong match and high score.
    const pull = (f: Friend) => (weight.get(f.id) ?? 0) ** 2 * f.scores[r.id];
    const backer = raters.filter((f) => weight.has(f.id)).sort((a, b) => pull(b) - pull(a))[0];
    recs.push({
      restaurantId: r.id,
      predicted: round1(total / wsum),
      because: backer ? { friend: backer, match: Math.round(weight.get(backer.id)! * 100), score: backer.scores[r.id] } : undefined,
    });
  }
  return recs.sort((a, b) => b.predicted - a.predicted).slice(0, limit);
}

export interface Traits {
  favoriteCuisines: string[];
  priceLabel: string;
  priceEmoji: string;
  vibe?: string;
}

/** Plain-language summary of what your rankings say about you. */
export function tasteTraits(mine: Scores): Traits | undefined {
  const ids = Object.keys(mine);
  if (ids.length === 0) return undefined;
  const liked = ids.filter((id) => mine[id] >= 6.7);
  const basis = liked.length ? liked : ids;

  const cuisineScore = new Map<string, number>();
  for (const id of basis) {
    const c = getRestaurant(id).cuisine;
    cuisineScore.set(c, (cuisineScore.get(c) ?? 0) + mine[id]);
  }
  const favoriteCuisines = [...cuisineScore.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c]) => c);

  const avgPrice = basis.reduce((s, id) => s + getRestaurant(id).price, 0) / basis.length;
  const [priceLabel, priceEmoji] =
    avgPrice < 1.7 ? ["Cheap-eats hunter", "🪙"] : avgPrice < 2.6 ? ["Mid-range regular", "🍽️"] : ["Happy to splurge", "💎"];

  const tagCount = new Map<string, number>();
  for (const id of basis) for (const t of getRestaurant(id).tags) if (t !== "Iconic") tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
  const topTag = [...tagCount.entries()].sort((a, b) => b[1] - a[1])[0];

  return { favoriteCuisines, priceLabel, priceEmoji, vibe: topTag && topTag[1] >= 2 ? topTag[0] : undefined };
}
