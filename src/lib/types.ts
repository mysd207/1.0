export type Sentiment = "liked" | "fine" | "disliked";

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  city: string;
  price: 1 | 2 | 3 | 4;
  emoji: string;
  blurb: string;
  tags: string[];
  lat: number;
  lng: number;
}

/** The user's ranked lists, each ordered best-first. */
export type Rankings = Record<Sentiment, string[]>;

export interface Visit {
  note: string;
  tags: string[];
  visitedAt: string; // ISO date
}

export interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  /** restaurantId -> score (0-10) */
  scores: Record<string, number>;
  /** restaurantId -> short review */
  notes: Record<string, string>;
}

export interface Activity {
  id: string;
  userId: string; // "me" or a friend id
  restaurantId: string;
  kind: "ranked" | "bookmarked";
  score?: number;
  note?: string;
  likes?: number; // likes from other people (seed data)
  at: string; // ISO timestamp
}

export interface AppState {
  rankings: Rankings;
  visits: Record<string, Visit>;
  wantToTry: string[];
  activity: Activity[];
  likedActivity: string[];
  following: string[];
  yearlyGoal: number;
}
