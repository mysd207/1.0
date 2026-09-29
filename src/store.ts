import { useEffect, useReducer } from "react";
import { INITIAL_STATE } from "./data/seed";
import { insertAt, removeFrom, scoresFor } from "./lib/ranking";
import type { AppState, OnboardingEntry, Sentiment } from "./lib/types";

const STORAGE_KEY = "beli-prototype:v2";

export type Action =
  | { type: "rank"; restaurantId: string; sentiment: Sentiment; index: number; note: string; tags: string[]; silent?: boolean }
  | { type: "unrank"; restaurantId: string }
  | { type: "toggleWantToTry"; restaurantId: string }
  | { type: "toggleLike"; activityId: string }
  | { type: "toggleFollow"; friendId: string }
  | { type: "setGoal"; goal: number }
  | { type: "finishOnboarding"; follow: string[] }
  | { type: "restartOnboarding"; entry: OnboardingEntry }
  | { type: "setCity"; city: string }
  | { type: "reset" };

function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [id, ...list];
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "rank": {
      const rankings = insertAt(state.rankings, action.sentiment, action.restaurantId, action.index);
      const score = scoresFor(rankings)[action.restaurantId];
      const now = new Date().toISOString();
      return {
        ...state,
        rankings,
        visits: {
          ...state.visits,
          [action.restaurantId]: { note: action.note, tags: action.tags, visitedAt: now },
        },
        wantToTry: state.wantToTry.filter((id) => id !== action.restaurantId),
        // Calibration rankings are silent so onboarding doesn't flood the feed.
        activity: action.silent
          ? state.activity
          : [
              { id: newId(), userId: "me", restaurantId: action.restaurantId, kind: "ranked", score, note: action.note || undefined, at: now },
              // Re-ranking replaces your earlier post for the same place.
              ...state.activity.filter((a) => !(a.userId === "me" && a.kind === "ranked" && a.restaurantId === action.restaurantId)),
            ],
      };
    }
    case "unrank": {
      const { [action.restaurantId]: _removed, ...visits } = state.visits;
      return {
        ...state,
        rankings: removeFrom(state.rankings, action.restaurantId),
        visits,
        activity: state.activity.filter((a) => !(a.userId === "me" && a.restaurantId === action.restaurantId)),
      };
    }
    case "toggleWantToTry": {
      const has = state.wantToTry.includes(action.restaurantId);
      return {
        ...state,
        wantToTry: toggle(state.wantToTry, action.restaurantId),
        activity: has
          ? state.activity.filter((a) => !(a.userId === "me" && a.kind === "bookmarked" && a.restaurantId === action.restaurantId))
          : [
              { id: newId(), userId: "me", restaurantId: action.restaurantId, kind: "bookmarked", at: new Date().toISOString() },
              ...state.activity,
            ],
      };
    }
    case "toggleLike":
      return { ...state, likedActivity: toggle(state.likedActivity, action.activityId) };
    case "toggleFollow":
      return { ...state, following: toggle(state.following, action.friendId) };
    case "setGoal":
      return { ...state, yearlyGoal: Math.max(1, Math.min(365, action.goal)) };
    case "finishOnboarding":
      return {
        ...state,
        onboarded: true,
        onboardingEntry: undefined,
        following: [...state.following, ...action.follow.filter((id) => !state.following.includes(id))],
      };
    case "restartOnboarding":
      return { ...state, onboarded: false, onboardingEntry: action.entry };
    case "setCity":
      return { ...state, city: action.city };
    case "reset":
      return INITIAL_STATE;
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<AppState>;
      // Saves from before onboarding existed: skip it for anyone with rankings.
      const hasRankings = saved.rankings && Object.values(saved.rankings).some((l) => l.length > 0);
      return { ...INITIAL_STATE, onboarded: Boolean(hasRankings), ...saved };
    }
  } catch {
    // Storage unavailable or corrupt; start fresh.
  }
  return INITIAL_STATE;
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota / private-mode errors.
    }
  }, [state]);
  return [state, dispatch] as const;
}
