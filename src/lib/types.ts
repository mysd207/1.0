export type Sentiment = "liked" | "fine" | "disliked";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  city: string;
  price: 1 | 2 | 3 | 4;
  emoji: string;
}

/** The user's ranked lists, each ordered best-first. */
export type Rankings = Record<Sentiment, string[]>;

export interface Visit {
  note: string;
  visitedAt: string; // ISO date
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  /** restaurantId -> score (0-10) */
  scores: Record<string, number>;
}

export interface Activity {
  id: string;
  userId: string; // "me" or a friend id
  restaurantId: string;
  kind: "ranked" | "bookmarked";
  score?: number;
  note?: string;
  at: string; // ISO timestamp
}

export interface AppState {
  rankings: Rankings;
  visits: Record<string, Visit>;
  wantToTry: string[];
  activity: Activity[];
}
