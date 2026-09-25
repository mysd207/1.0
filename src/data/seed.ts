import type { Activity, AppState, Friend, Restaurant } from "../lib/types";

// Fictional restaurants so the prototype has something to rank.
// Coordinates are approximate neighborhood centers, used by the map view.
export const RESTAURANTS: Restaurant[] = [
  { id: "r1", name: "Nonna Lucia", cuisine: "Italian", neighborhood: "West Village", city: "New York", price: 3, emoji: "🍝", lat: 40.734, lng: -74.004,
    blurb: "Handmade pasta in a candlelit brownstone. Cacio e pepe is the move.", tags: ["Date night", "Pasta", "Cozy"] },
  { id: "r2", name: "Sora Omakase", cuisine: "Japanese", neighborhood: "Flatiron", city: "New York", price: 4, emoji: "🍣", lat: 40.741, lng: -73.99,
    blurb: "Twelve-seat counter with an 18-course omakase flown in from Toyosu.", tags: ["Omakase", "Special occasion", "Reservations"] },
  { id: "r3", name: "Taquería El Sol", cuisine: "Mexican", neighborhood: "Bushwick", city: "New York", price: 1, emoji: "🌮", lat: 40.694, lng: -73.921,
    blurb: "Trompo-carved al pastor and handmade tortillas until 2am.", tags: ["Late night", "Great value", "Tacos"] },
  { id: "r4", name: "Golden Dumpling House", cuisine: "Chinese", neighborhood: "Chinatown", city: "New York", price: 1, emoji: "🥟", lat: 40.716, lng: -73.997,
    blurb: "Pork and chive dumplings, 8 for $5. Cash only, zero frills.", tags: ["Great value", "Cash only", "Quick bite"] },
  { id: "r5", name: "Le Petit Zinc", cuisine: "French", neighborhood: "SoHo", city: "New York", price: 3, emoji: "🥐", lat: 40.723, lng: -74.0,
    blurb: "Classic bistro: steak frites, escargots and a zinc bar.", tags: ["Brunch", "Bistro", "Wine"] },
  { id: "r6", name: "Seoul Fire BBQ", cuisine: "Korean", neighborhood: "Koreatown", city: "New York", price: 2, emoji: "🥩", lat: 40.748, lng: -73.987,
    blurb: "Charcoal-grilled galbi with endless banchan. Bring a crew.", tags: ["Groups", "BBQ", "Late night"] },
  { id: "r7", name: "Bangkok Alley", cuisine: "Thai", neighborhood: "Elmhurst", city: "New York", price: 1, emoji: "🍜", lat: 40.737, lng: -73.878,
    blurb: "Fiery boat noodles and crispy pork that locals line up for.", tags: ["Spicy", "Great value", "Hidden gem"] },
  { id: "r8", name: "Olive & Thyme", cuisine: "Mediterranean", neighborhood: "Williamsburg", city: "New York", price: 2, emoji: "🫒", lat: 40.714, lng: -73.961,
    blurb: "Mezze spreads and wood-fired flatbreads on a leafy patio.", tags: ["Outdoor seating", "Vegetarian friendly", "Groups"] },
  { id: "r9", name: "Slice Society", cuisine: "Pizza", neighborhood: "Greenpoint", city: "New York", price: 1, emoji: "🍕", lat: 40.73, lng: -73.951,
    blurb: "Naturally leavened slices with a crackly, charred crust.", tags: ["Quick bite", "Great value", "Pizza"] },
  { id: "r10", name: "The Brass Rail", cuisine: "American", neighborhood: "Tribeca", city: "New York", price: 3, emoji: "🍔", lat: 40.716, lng: -74.009,
    blurb: "Dry-aged burger, martinis and red leather booths.", tags: ["Burgers", "Cocktails", "Date night"] },
  { id: "r11", name: "Masala Junction", cuisine: "Indian", neighborhood: "East Village", city: "New York", price: 2, emoji: "🍛", lat: 40.727, lng: -73.984,
    blurb: "Regional thalis and a butter chicken worth crossing town for.", tags: ["Spicy", "Vegetarian friendly", "Groups"] },
  { id: "r12", name: "Pho Real", cuisine: "Vietnamese", neighborhood: "Lower East Side", city: "New York", price: 1, emoji: "🍲", lat: 40.715, lng: -73.985,
    blurb: "Twelve-hour broth, fresh herbs piled high.", tags: ["Great value", "Soup", "Quick bite"] },
  { id: "r13", name: "Casa Verde", cuisine: "Spanish", neighborhood: "Chelsea", city: "New York", price: 3, emoji: "🥘", lat: 40.746, lng: -74.001,
    blurb: "Paella for two and a sherry list that goes on for pages.", tags: ["Tapas", "Wine", "Date night"] },
  { id: "r14", name: "Morning Glory Bakery", cuisine: "Bakery", neighborhood: "Park Slope", city: "New York", price: 1, emoji: "🥯", lat: 40.672, lng: -73.977,
    blurb: "Hand-rolled bagels and cardamom buns. Sells out by noon.", tags: ["Breakfast", "Coffee", "Quick bite"] },
  { id: "r15", name: "Ember & Oak", cuisine: "Steakhouse", neighborhood: "Midtown", city: "New York", price: 4, emoji: "🔥", lat: 40.754, lng: -73.984,
    blurb: "45-day dry-aged porterhouse and tableside Caesar.", tags: ["Special occasion", "Steak", "Cocktails"] },
  { id: "r16", name: "Ramen Yokocho", cuisine: "Japanese", neighborhood: "East Village", city: "New York", price: 2, emoji: "🍜", lat: 40.729, lng: -73.987,
    blurb: "Rich tonkotsu and a tiny bar. Expect a wait.", tags: ["Worth the wait", "Ramen", "Solo dining"] },
  { id: "r17", name: "Tavola Rustica", cuisine: "Italian", neighborhood: "Carroll Gardens", city: "New York", price: 2, emoji: "🍷", lat: 40.679, lng: -73.999,
    blurb: "Neighborhood trattoria with a garden out back.", tags: ["Outdoor seating", "Pasta", "Wine"] },
  { id: "r18", name: "Green Bowl", cuisine: "Vegetarian", neighborhood: "NoHo", city: "New York", price: 2, emoji: "🥗", lat: 40.726, lng: -73.993,
    blurb: "Grain bowls that actually fill you up.", tags: ["Healthy", "Vegetarian friendly", "Quick bite"] },
  { id: "r19", name: "Harbor Oyster Bar", cuisine: "Seafood", neighborhood: "Red Hook", city: "New York", price: 3, emoji: "🦪", lat: 40.675, lng: -74.01,
    blurb: "Buck-a-shuck happy hour with a view of the Statue of Liberty.", tags: ["Happy hour", "Waterfront", "Seafood"] },
  { id: "r20", name: "Addis Kitchen", cuisine: "Ethiopian", neighborhood: "Harlem", city: "New York", price: 1, emoji: "🫓", lat: 40.811, lng: -73.946,
    blurb: "Family-run spot. The veggie combo feeds three.", tags: ["Vegetarian friendly", "Great value", "Groups"] },
  { id: "r21", name: "Beirut Grill", cuisine: "Lebanese", neighborhood: "Bay Ridge", city: "New York", price: 2, emoji: "🧆", lat: 40.626, lng: -74.03,
    blurb: "Charcoal kebabs, garlicky toum and fresh-baked pita.", tags: ["Groups", "Hidden gem", "Grill"] },
  { id: "r22", name: "Sweet Spot Creamery", cuisine: "Dessert", neighborhood: "Nolita", city: "New York", price: 1, emoji: "🍦", lat: 40.722, lng: -73.995,
    blurb: "Small-batch ice cream with rotating weird flavors.", tags: ["Dessert", "Quick bite", "Late night"] },
  { id: "r23", name: "Midnight Diner", cuisine: "Diner", neighborhood: "Hell's Kitchen", city: "New York", price: 1, emoji: "🍳", lat: 40.764, lng: -73.992,
    blurb: "24/7 diner with bottomless coffee and huge omelets.", tags: ["Late night", "Breakfast", "Great value"] },
  { id: "r24", name: "Kanpai Izakaya", cuisine: "Japanese", neighborhood: "Astoria", city: "New York", price: 2, emoji: "🍶", lat: 40.764, lng: -73.923,
    blurb: "Yakitori, highballs and a sake list for every mood.", tags: ["Cocktails", "Groups", "Late night"] },
];

export const FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Maya Chen",
    handle: "mayaeats",
    avatar: "🦊",
    bio: "Will cross boroughs for a good dumpling.",
    scores: { r2: 10, r4: 9.4, r6: 8.8, r16: 8.1, r1: 7.5, r9: 6.2, r10: 5.1, r23: 3.9, r15: 2.8 },
    notes: {
      r2: "Best omakase I've had all year. The uni course 🤯",
      r4: "Cheapest great meal in the city.",
      r16: "Worth the 40-minute wait. Barely.",
      r23: "Fine at 2am, less so at 2pm.",
      r15: "$$$$ for a steak I could make at home.",
    },
  },
  {
    id: "f2",
    name: "Jordan Reyes",
    handle: "jreyes",
    avatar: "🐻",
    bio: "Tacos, steak, repeat.",
    scores: { r3: 10, r15: 9.6, r10: 9.1, r13: 8.3, r7: 7.7, r19: 7.0, r5: 6.1, r18: 4.4 },
    notes: {
      r3: "Al pastor tacos are unreal.",
      r15: "Porterhouse for two. Clear your evening.",
      r10: "Best burger in Manhattan, I will not be taking questions.",
      r18: "Healthy, sure. Hungry an hour later.",
    },
  },
  {
    id: "f3",
    name: "Priya Patel",
    handle: "priyaplates",
    avatar: "🐼",
    bio: "Vegetarian, not boring about it.",
    scores: { r11: 10, r20: 9.3, r8: 8.9, r18: 8.4, r21: 7.9, r12: 7.2, r14: 6.8, r22: 6.0, r2: 5.5 },
    notes: {
      r11: "Tastes like my aunt's cooking. Highest compliment.",
      r20: "Get the veggie combo and extra injera.",
      r8: "That patio in September 🌿",
      r2: "Beautiful, but not much for vegetarians.",
    },
  },
  {
    id: "f4",
    name: "Sam Okafor",
    handle: "samo",
    avatar: "🦉",
    bio: "Oysters are a personality trait.",
    scores: { r19: 10, r5: 9.2, r1: 8.7, r17: 8.0, r24: 7.4, r6: 7.0, r9: 5.8, r3: 4.9 },
    notes: {
      r19: "Oysters and sunset on the pier.",
      r5: "Steak frites like I'm back in Paris.",
      r1: "Book 30 days out, it's worth it.",
    },
  },
  {
    id: "f5",
    name: "Lena Novak",
    handle: "lenaloves",
    avatar: "🐨",
    bio: "Brunch is the most important meal.",
    scores: { r14: 10, r5: 9.0, r22: 8.6, r1: 8.2, r12: 7.6, r17: 7.1, r9: 6.4, r23: 5.2, r6: 4.1, r7: 3.0 },
    notes: {
      r14: "Cardamom bun changed my life.",
      r22: "Miso caramel scoop, trust me.",
      r7: "Too spicy for me, but the crowd loved it.",
    },
  },
  {
    id: "f6",
    name: "Diego Alvarez",
    handle: "dieguito",
    avatar: "🐯",
    bio: "Exploring every borough, one menu at a time.",
    scores: { r7: 10, r21: 9.5, r20: 9.0, r3: 8.8, r24: 8.2, r12: 7.9, r4: 7.3, r11: 6.9, r8: 6.3, r10: 5.0, r13: 4.2 },
    notes: {
      r7: "Boat noodles = Elmhurst's best-kept secret.",
      r21: "Worth the R train all the way down.",
      r24: "Tsukune and a highball, perfect Tuesday.",
    },
  },
];

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

type SeedActivity = Omit<Activity, "id" | "at" | "score" | "note"> & { hours: number };

const SEED: SeedActivity[] = [
  { userId: "f1", restaurantId: "r2", kind: "ranked", likes: 12, hours: 2 },
  { userId: "f6", restaurantId: "r7", kind: "ranked", likes: 8, hours: 3 },
  { userId: "f3", restaurantId: "r20", kind: "ranked", likes: 5, hours: 5 },
  { userId: "f5", restaurantId: "r14", kind: "ranked", likes: 9, hours: 7 },
  { userId: "f2", restaurantId: "r3", kind: "ranked", likes: 6, hours: 9 },
  { userId: "f4", restaurantId: "r13", kind: "bookmarked", hours: 14 },
  { userId: "f6", restaurantId: "r21", kind: "ranked", likes: 4, hours: 20 },
  { userId: "f4", restaurantId: "r19", kind: "ranked", likes: 15, hours: 26 },
  { userId: "f1", restaurantId: "r23", kind: "ranked", likes: 3, hours: 31 },
  { userId: "f5", restaurantId: "r2", kind: "bookmarked", hours: 40 },
  { userId: "f2", restaurantId: "r10", kind: "ranked", likes: 7, hours: 44 },
  { userId: "f3", restaurantId: "r11", kind: "ranked", likes: 11, hours: 48 },
  { userId: "f2", restaurantId: "r16", kind: "bookmarked", hours: 60 },
  { userId: "f1", restaurantId: "r4", kind: "ranked", likes: 10, hours: 72 },
  { userId: "f5", restaurantId: "r22", kind: "ranked", likes: 2, hours: 90 },
];

const FRIEND_ACTIVITY: Activity[] = SEED.map(({ hours, ...a }, i) => {
  const friend = FRIENDS.find((f) => f.id === a.userId)!;
  return {
    ...a,
    id: `seed${i + 1}`,
    at: hoursAgo(hours),
    score: a.kind === "ranked" ? friend.scores[a.restaurantId] : undefined,
    note: a.kind === "ranked" ? friend.notes[a.restaurantId] : undefined,
  };
});

export const INITIAL_STATE: AppState = {
  rankings: { liked: [], fine: [], disliked: [] },
  visits: {},
  wantToTry: [],
  activity: FRIEND_ACTIVITY,
  likedActivity: [],
  following: FRIENDS.slice(0, 4).map((f) => f.id),
  yearlyGoal: 25,
};

export const QUICK_TAGS = [
  "Date night",
  "Great value",
  "Worth the wait",
  "Groups",
  "Cozy",
  "Late night",
  "Solo dining",
  "Special occasion",
];
