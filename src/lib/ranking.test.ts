import { describe, expect, it } from "vitest";
import {
  answer,
  insertAt,
  isDone,
  pivotIndex,
  scoreAt,
  scoresFor,
  startComparison,
  tie,
} from "./ranking";
import type { Rankings } from "./types";

const empty: Rankings = { liked: [], fine: [], disliked: [] };

describe("scoreAt", () => {
  it("gives the top liked item a 10", () => {
    expect(scoreAt("liked", 0, 5)).toBe(10);
  });

  it("keeps bands from overlapping", () => {
    const worstLiked = scoreAt("liked", 99, 100);
    const bestFine = scoreAt("fine", 0, 100);
    const worstFine = scoreAt("fine", 99, 100);
    const bestDisliked = scoreAt("disliked", 0, 100);
    expect(worstLiked).toBeGreaterThan(bestFine);
    expect(worstFine).toBeGreaterThan(bestDisliked);
  });

  it("decreases monotonically within a band", () => {
    const scores = [0, 1, 2, 3].map((i) => scoreAt("fine", i, 4));
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });
});

describe("binary insertion", () => {
  // Simulates ranking `value` into a list of numbers ordered high-first.
  function rankInto(list: number[], value: number): number {
    let c = startComparison(list.length);
    let steps = 0;
    while (!isDone(c)) {
      c = answer(c, value > list[pivotIndex(c)]);
      steps++;
    }
    expect(steps).toBeLessThanOrEqual(Math.ceil(Math.log2(list.length + 1)));
    return c.lo;
  }

  it("finds the correct slot", () => {
    const list = [90, 70, 50, 30, 10];
    expect(rankInto(list, 100)).toBe(0);
    expect(rankInto(list, 60)).toBe(2);
    expect(rankInto(list, 5)).toBe(5);
    expect(rankInto([], 42)).toBe(0);
  });

  it("stops immediately on a tie", () => {
    const c = tie(startComparison(8));
    expect(isDone(c)).toBe(true);
    expect(c.lo).toBe(4);
  });
});

describe("insertAt", () => {
  it("moves an item between bands", () => {
    let r = insertAt(empty, "liked", "a", 0);
    r = insertAt(r, "liked", "b", 1);
    r = insertAt(r, "fine", "a", 0);
    expect(r).toEqual({ liked: ["b"], fine: ["a"], disliked: [] });
    expect(scoresFor(r)).toEqual({ b: 10, a: 6.6 });
  });
});
