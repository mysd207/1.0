import { createContext, useContext, type Dispatch } from "react";
import type { AppState } from "./lib/types";
import type { Action } from "./store";

export type Screen =
  | { kind: "restaurant"; id: string }
  | { kind: "friend"; id: string; tab?: "activity" | "taste" | "lists" }
  | { kind: "rank"; id: string }
  | { kind: "result"; id: string; previousScore?: number }
  | { kind: "list"; id: string };

export type Tab = "feed" | "lists" | "search" | "leaderboard" | "profile";
export type ListTab = "been" | "want" | "recs";

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  scores: Record<string, number>;
  push: (screen: Screen) => void;
  replace: (screen: Screen) => void;
  back: () => void;
  /** Jump to a bottom tab (clearing any open screens). */
  goTab: (tab: Tab, listTab?: ListTab) => void;
  /** Brief message for things the prototype doesn't do. */
  toast: (message: string) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppContext");
  return ctx;
}
