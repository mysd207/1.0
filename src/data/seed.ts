import type { Activity, AppState, Friend, Restaurant } from "../lib/types";

// Fictional restaurants so the prototype has something to rank.
export const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "Nonna Lucia", cuisine: "Italian", neighborhood: "West Village", city: "New York", price: 3, emoji: "🍝" },
  { id: "r2", name: "Sora Omakase", cuisine: "Japanese", neighborhood: "Flatiron", city: "New York", price: 4, emoji: "🍣" },
  { id: "r3", name: "Taquería El Sol", cuisine: "Mexican", neighborhood: "Bushwick", city: "New York", price: 1, emoji: "🌮" },
  { id: "r4", name: "Golden Dumpling House", cuisine: "Chinese", neighborhood: "Chinatown", city: "New York", price: 1, emoji: "🥟" },
  { id: "r5", name: "Le Petit Zinc", cuisine: "French", neighborhood: "SoHo", city: "New York", price: 3, emoji: "🥐" },
  { id: "r6", name: "Seoul Fire BBQ", cuisine: "Korean", neighborhood: "Koreatown", city: "New York", price: 2, emoji: "🥩" },
  { id: "r7", name: "Bangkok Alley", cuisine: "Thai", neighborhood: "Elmhurst", city: "New York", price: 1, emoji: "🍜" },
  { id: "r8", name: "Olive & Thyme", cuisine: "Mediterranean", neighborhood: "Williamsburg", city: "New York", price: 2, emoji: "🫒" },
  { id: "r9", name: "Slice Society", cuisine: "Pizza", neighborhood: "Greenpoint", city: "New York", price: 1, emoji: "🍕" },
  { id: "r10", name: "The Brass Rail", cuisine: "American", neighborhood: "Tribeca", city: "New York", price: 3, emoji: "🍔" },
  { id: "r11", name: "Masala Junction", cuisine: "Indian", neighborhood: "East Village", city: "New York", price: 2, emoji: "🍛" },
  { id: "r12", name: "Pho Real", cuisine: "Vietnamese", neighborhood: "Lower East Side", city: "New York", price: 1, emoji: "🍲" },
  { id: "r13", name: "Casa Verde", cuisine: "Spanish", neighborhood: "Chelsea", city: "New York", price: 3, emoji: "🥘" },
  { id: "r14", name: "Morning Glory Bakery", cuisine: "Bakery", neighborhood: "Park Slope", city: "New York", price: 1, emoji: "🥯" },
  { id: "r15", name: "Ember & Oak", cuisine: "Steakhouse", neighborhood: "Midtown", city: "New York", price: 4, emoji: "🔥" },
  { id: "r16", name: "Ramen Yokocho", cuisine: "Japanese", neighborhood: "East Village", city: "New York", price: 2, emoji: "🍜" },
  { id: "r17", name: "Tavola Rustica", cuisine: "Italian", neighborhood: "Carroll Gardens", city: "New York", price: 2, emoji: "🍷" },
  { id: "r18", name: "Green Bowl", cuisine: "Vegetarian", neighborhood: "NoHo", city: "New York", price: 2, emoji: "🥗" },
  { id: "r19", name: "Harbor Oyster Bar", cuisine: "Seafood", neighborhood: "Red Hook", city: "New York", price: 3, emoji: "🦪" },
  { id: "r20", name: "Addis Kitchen", cuisine: "Ethiopian", neighborhood: "Harlem", city: "New York", price: 1, emoji: "🫓" },
  { id: "r21", name: "Beirut Grill", cuisine: "Lebanese", neighborhood: "Bay Ridge", city: "New York", price: 2, emoji: "🧆" },
  { id: "r22", name: "Sweet Spot Creamery", cuisine: "Dessert", neighborhood: "Nolita", city: "New York", price: 1, emoji: "🍦" },
  { id: "r23", name: "Midnight Diner", cuisine: "Diner", neighborhood: "Hell's Kitchen", city: "New York", price: 1, emoji: "🍳" },
  { id: "r24", name: "Kanpai Izakaya", cuisine: "Japanese", neighborhood: "Astoria", city: "New York", price: 2, emoji: "🍶" },
];

export const FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Maya Chen",
    avatar: "🦊",
    scores: { r2: 10, r4: 9.4, r6: 8.8, r16: 8.1, r1: 7.5, r9: 6.2, r10: 5.1, r23: 3.9, r15: 2.8 },
  },
  {
    id: "f2",
    name: "Jordan Reyes",
    avatar: "🐻",
    scores: { r3: 10, r15: 9.6, r10: 9.1, r13: 8.3, r7: 7.7, r19: 7.0, r5: 6.1, r18: 4.4 },
  },
  {
    id: "f3",
    name: "Priya Patel",
    avatar: "🐼",
    scores: { r11: 10, r20: 9.3, r8: 8.9, r18: 8.4, r21: 7.9, r12: 7.2, r14: 6.8, r22: 6.0, r2: 5.5 },
  },
  {
    id: "f4",
    name: "Sam Okafor",
    avatar: "🦉",
    scores: { r19: 10, r5: 9.2, r1: 8.7, r17: 8.0, r24: 7.4, r6: 7.0, r9: 5.8, r3: 4.9 },
  },
];

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

const FRIEND_ACTIVITY: Activity[] = [
  { id: "a1", userId: "f1", restaurantId: "r2", kind: "ranked", score: 10, note: "Best omakase I've had all year. The uni course 🤯", at: hoursAgo(2) },
  { id: "a2", userId: "f3", restaurantId: "r20", kind: "ranked", score: 9.3, note: "Get the veggie combo and extra injera.", at: hoursAgo(5) },
  { id: "a3", userId: "f2", restaurantId: "r3", kind: "ranked", score: 10, note: "Al pastor tacos are unreal", at: hoursAgo(9) },
  { id: "a4", userId: "f4", restaurantId: "r13", kind: "bookmarked", at: hoursAgo(14) },
  { id: "a5", userId: "f4", restaurantId: "r19", kind: "ranked", score: 10, note: "Oysters + sunset on the pier.", at: hoursAgo(26) },
  { id: "a6", userId: "f1", restaurantId: "r23", kind: "ranked", score: 3.9, note: "Fine at 2am, less so at 2pm.", at: hoursAgo(31) },
  { id: "a7", userId: "f3", restaurantId: "r11", kind: "ranked", score: 10, at: hoursAgo(48) },
  { id: "a8", userId: "f2", restaurantId: "r16", kind: "bookmarked", at: hoursAgo(60) },
];

export const INITIAL_STATE: AppState = {
  rankings: { liked: [], fine: [], disliked: [] },
  visits: {},
  wantToTry: [],
  activity: FRIEND_ACTIVITY,
};
