import { describe, expect, it } from "vitest";
import { INITIAL_STATE } from "./data/seed";
import { tasteMatch } from "./lib/helpers";
import { reducer } from "./store";

describe("reducer", () => {
  it("ranking removes the place from want-to-try and posts one activity", () => {
    let s = reducer(INITIAL_STATE, { type: "toggleWantToTry", restaurantId: "r1" });
    expect(s.wantToTry).toEqual(["r1"]);
    s = reducer(s, { type: "rank", restaurantId: "r1", sentiment: "liked", index: 0, note: "yum", tags: ["Cozy"] });
    expect(s.wantToTry).toEqual([]);
    expect(s.visits.r1.tags).toEqual(["Cozy"]);
    s = reducer(s, { type: "rank", restaurantId: "r1", sentiment: "fine", index: 0, note: "meh", tags: [] });
    const mine = s.activity.filter((a) => a.userId === "me" && a.kind === "ranked");
    expect(mine).toHaveLength(1);
    expect(mine[0].note).toBe("meh");
    expect(s.rankings).toEqual({ liked: [], fine: ["r1"], disliked: [] });
  });

  it("un-saving removes the bookmark post", () => {
    let s = reducer(INITIAL_STATE, { type: "toggleWantToTry", restaurantId: "r5" });
    s = reducer(s, { type: "toggleWantToTry", restaurantId: "r5" });
    expect(s.activity).toEqual(INITIAL_STATE.activity);
  });

  it("clamps the yearly goal", () => {
    expect(reducer(INITIAL_STATE, { type: "setGoal", goal: -10 }).yearlyGoal).toBe(1);
  });
});

describe("tasteMatch", () => {
  it("is undefined without overlap", () => {
    expect(tasteMatch({ a: 9 }, { b: 9 })).toBeUndefined();
  });

  it("drops 10 points per point of average disagreement", () => {
    expect(tasteMatch({ a: 9, b: 5 }, { a: 9, b: 5, c: 1 })).toBe(100);
    expect(tasteMatch({ a: 9, b: 5 }, { a: 8, b: 2 })).toBe(80);
  });
});
