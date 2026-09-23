import type { Rankings, Sentiment } from "./types";

/**
 * Score band for each sentiment. Items within a band are spread evenly by
 * rank, so the best "liked" place is always 10.0 and a band never overlaps
 * the one below it.
 */
export const BANDS: Record<Sentiment, { lo: number; hi: number }> = {
  liked: { lo: 6.7, hi: 10 },
  fine: { lo: 3.3, hi: 6.6 },
  disliked: { lo: 0, hi: 3.2 },
};

export const SENTIMENTS: Sentiment[] = ["liked", "fine", "disliked"];

export function scoreAt(sentiment: Sentiment, index: number, count: number): number {
  const { lo, hi } = BANDS[sentiment];
  const raw = lo + ((hi - lo) * (count - index)) / count;
  return Math.round(raw * 10) / 10;
}

export function scoresFor(rankings: Rankings): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of SENTIMENTS) {
    const list = rankings[s];
    list.forEach((id, i) => {
      out[id] = scoreAt(s, i, list.length);
    });
  }
  return out;
}

/** All ranked ids ordered best-first across bands. */
export function overallOrder(rankings: Rankings): string[] {
  return SENTIMENTS.flatMap((s) => rankings[s]);
}

export function sentimentOf(rankings: Rankings, id: string): Sentiment | undefined {
  return SENTIMENTS.find((s) => rankings[s].includes(id));
}

export function removeFrom(rankings: Rankings, id: string): Rankings {
  return {
    liked: rankings.liked.filter((x) => x !== id),
    fine: rankings.fine.filter((x) => x !== id),
    disliked: rankings.disliked.filter((x) => x !== id),
  };
}

export function insertAt(rankings: Rankings, sentiment: Sentiment, id: string, index: number): Rankings {
  const cleaned = removeFrom(rankings, id);
  const list = [...cleaned[sentiment]];
  list.splice(index, 0, id);
  return { ...cleaned, [sentiment]: list };
}

/**
 * Binary-search insertion driven by head-to-head comparisons. `lo`/`hi`
 * bound the slot the new item can land in within the band's list.
 */
export interface Comparison {
  lo: number;
  hi: number;
}

export function startComparison(listLength: number): Comparison {
  return { lo: 0, hi: listLength };
}

export function pivotIndex(c: Comparison): number {
  return Math.floor((c.lo + c.hi) / 2);
}

export function isDone(c: Comparison): boolean {
  return c.lo >= c.hi;
}

/** `newIsBetter` means the new item beat the item at the pivot. */
export function answer(c: Comparison, newIsBetter: boolean): Comparison {
  const mid = pivotIndex(c);
  return newIsBetter ? { lo: c.lo, hi: mid } : { lo: mid + 1, hi: c.hi };
}

/** "Too tough to call": place it right next to the pivot and stop. */
export function tie(c: Comparison): Comparison {
  const mid = pivotIndex(c);
  return { lo: mid, hi: mid };
}

export function maxComparisons(listLength: number): number {
  return listLength === 0 ? 0 : Math.ceil(Math.log2(listLength + 1));
}
