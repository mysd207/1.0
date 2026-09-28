import { describe, expect, it } from "vitest";
import { friendMatches, matchReason, personalizedRecs, tasteTraits } from "./taste";

describe("friendMatches", () => {
  it("ranks the person who agrees with you first and explains why", () => {
    // Close to Jordan (f2) on Peter Luger and Los Tacos; far from Priya (f3) on Peter Luger.
    const mine = { i4: 9.9, i8: 9.2 };
    const matches = friendMatches(mine);
    expect(matches[0].friend.id).toBe("f2");
    expect(matches[0].agreements).toEqual(["i4", "i8"]);
    expect(matchReason(matches[0])).toContain("Peter Luger");
    const priya = matches.find((m) => m.friend.id === "f3")!;
    expect(priya.disagreements).toContain("i4");
    expect(priya.match).toBeLessThan(matches[0].match);
  });

  it("returns nothing before you've ranked anything", () => {
    expect(friendMatches({})).toEqual([]);
  });
});

describe("personalizedRecs", () => {
  it("never recommends places you've already ranked", () => {
    const recs = personalizedRecs({ i4: 9.9 }, ["f1", "f2"]);
    expect(recs.some((r) => r.restaurantId === "i4")).toBe(false);
  });

  it("leans toward the best-matched person's favorites", () => {
    const mine = { i4: 9.9, i8: 9.2, i10: 9.0 };
    const top = personalizedRecs(mine, [])[0];
    expect(top.because?.friend.id).toBe("f2");
  });

  it("credits the person who pulls the prediction up, not just the best match", () => {
    const mine = { i4: 9.9, i8: 9.2, i1: 9.0, i3: 5.0, i5: 7.8, i6: 6.6 };
    const levain = personalizedRecs(mine, ["f1", "f2", "f3", "f4"], 50).find((r) => r.restaurantId === "i9")!;
    expect(levain.because!.score).toBeGreaterThanOrEqual(levain.predicted - 1);
  });
});

describe("tasteTraits", () => {
  it("summarizes price and cuisine leanings", () => {
    const t = tasteTraits({ i2: 9.5, i12: 9.0, i11: 8.0, i4: 2.0 })!;
    expect(t.favoriteCuisines[0]).toBe("Pizza");
    expect(t.priceLabel).toBe("Cheap-eats hunter");
  });
});
