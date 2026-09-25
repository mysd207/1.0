import { createContext, useContext, type Dispatch } from "react";
import type { AppState } from "./lib/types";
import type { Action } from "./store";

export type Screen =
  | { kind: "restaurant"; id: string }
  | { kind: "friend"; id: string }
  | { kind: "rank"; id: string }
  | { kind: "result"; id: string; previousScore?: number };

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
  scores: Record<string, number>;
  push: (screen: Screen) => void;
  replace: (screen: Screen) => void;
  back: () => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppContext");
  return ctx;
}
