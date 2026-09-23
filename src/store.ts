import { useEffect, useReducer } from "react";
import { INITIAL_STATE } from "./data/seed";
import { insertAt, removeFrom, scoresFor } from "./lib/ranking";
import type { AppState, Sentiment } from "./lib/types";

const STORAGE_KEY = "beli-prototype:v1";

export type Action =
  | { type: "rank"; restaurantId: string; sentiment: Sentiment; index: number; note: string }
  | { type: "unrank"; restaurantId: string }
  | { type: "toggleWantToTry"; restaurantId: string }
  | { type: "reset" };

function newId(): string {
  return Math.random().toString(36).slice(2, 10);
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
        visits: { ...state.visits, [action.restaurantId]: { note: action.note, visitedAt: now } },
        wantToTry: state.wantToTry.filter((id) => id !== action.restaurantId),
        activity: [
          { id: newId(), userId: "me", restaurantId: action.restaurantId, kind: "ranked", score, note: action.note || undefined, at: now },
          ...state.activity,
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
        wantToTry: has
          ? state.wantToTry.filter((id) => id !== action.restaurantId)
          : [action.restaurantId, ...state.wantToTry],
        activity: has
          ? state.activity
          : [
              { id: newId(), userId: "me", restaurantId: action.restaurantId, kind: "bookmarked", at: new Date().toISOString() },
              ...state.activity,
            ],
      };
    }
    case "reset":
      return INITIAL_STATE;
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...INITIAL_STATE, ...JSON.parse(raw) };
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
