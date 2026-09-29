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
  // Curated "most recognized" NYC list, used for taste calibration during onboarding.
  { id: "i1", name: "Katz's Delicatessen", cuisine: "Deli", neighborhood: "Lower East Side", city: "New York", price: 2, emoji: "🥪", lat: 40.7223, lng: -73.9874, iconic: true,
    blurb: "Towering hand-carved pastrami on rye, served since 1888.", tags: ["Classic", "Sandwiches", "Iconic"] },
  { id: "i2", name: "Joe's Pizza", cuisine: "Pizza", neighborhood: "Greenwich Village", city: "New York", price: 1, emoji: "🍕", lat: 40.7306, lng: -74.0021, iconic: true,
    blurb: "The classic New York slice: thin, foldable, no fuss.", tags: ["Quick bite", "Great value", "Iconic"] },
  { id: "i3", name: "Shake Shack (Madison Sq. Park)", cuisine: "American", neighborhood: "Flatiron", city: "New York", price: 1, emoji: "🍔", lat: 40.7414, lng: -73.9882, iconic: true,
    blurb: "The original park kiosk: ShackBurgers and crinkle-cut fries.", tags: ["Burgers", "Outdoor seating", "Iconic"] },
  { id: "i4", name: "Peter Luger", cuisine: "Steakhouse", neighborhood: "Williamsburg", city: "New York", price: 4, emoji: "🥩", lat: 40.7099, lng: -73.9623, iconic: true,
    blurb: "Porterhouse for two under the Williamsburg Bridge since 1887.", tags: ["Steak", "Special occasion", "Iconic"] },
  { id: "i5", name: "Xi'an Famous Foods", cuisine: "Chinese", neighborhood: "East Village", city: "New York", price: 1, emoji: "🌶️", lat: 40.7285, lng: -73.9885, iconic: true,
    blurb: "Hand-ripped noodles with spicy cumin lamb.", tags: ["Spicy", "Great value", "Iconic"] },
  { id: "i6", name: "Russ & Daughters", cuisine: "Deli", neighborhood: "Lower East Side", city: "New York", price: 2, emoji: "🐟", lat: 40.7226, lng: -73.9882, iconic: true,
    blurb: "Smoked fish and bagels from a fourth-generation appetizing shop.", tags: ["Breakfast", "Classic", "Iconic"] },
  { id: "i7", name: "Magnolia Bakery", cuisine: "Bakery", neighborhood: "West Village", city: "New York", price: 1, emoji: "🧁", lat: 40.7359, lng: -74.005, iconic: true,
    blurb: "Banana pudding and cupcakes with a cult following.", tags: ["Dessert", "Quick bite", "Iconic"] },
  { id: "i8", name: "Los Tacos No. 1", cuisine: "Mexican", neighborhood: "Chelsea", city: "New York", price: 1, emoji: "🌮", lat: 40.7424, lng: -74.0061, iconic: true,
    blurb: "Adobada tacos on fresh tortillas inside Chelsea Market.", tags: ["Tacos", "Quick bite", "Iconic"] },
  { id: "i9", name: "Levain Bakery", cuisine: "Bakery", neighborhood: "Upper West Side", city: "New York", price: 1, emoji: "🍪", lat: 40.7799, lng: -73.9803, iconic: true,
    blurb: "Six-ounce cookies, gooey in the middle.", tags: ["Dessert", "Worth the wait", "Iconic"] },
  { id: "i10", name: "Carbone", cuisine: "Italian", neighborhood: "Greenwich Village", city: "New York", price: 4, emoji: "🍝", lat: 40.7279, lng: -74.0005, iconic: true,
    blurb: "Red-sauce glamour and the famous spicy rigatoni.", tags: ["Pasta", "Special occasion", "Iconic"] },
  { id: "i11", name: "The Halal Guys", cuisine: "Middle Eastern", neighborhood: "Midtown", city: "New York", price: 1, emoji: "🥙", lat: 40.7618, lng: -73.979, iconic: true,
    blurb: "Chicken over rice with the famous white sauce.", tags: ["Late night", "Great value", "Iconic"] },
  { id: "i12", name: "Di Fara Pizza", cuisine: "Pizza", neighborhood: "Midwood", city: "New York", price: 2, emoji: "🧀", lat: 40.625, lng: -73.9615, iconic: true,
    blurb: "Hand-crafted pies worth the trek to Midwood.", tags: ["Pizza", "Worth the wait", "Iconic"] },
];

export const FRIENDS: Friend[] = [
  {
    id: "f1",
    name: "Maya Chen",
    handle: "mayaeats",
    avatar: "🦊",
    bio: "Will cross boroughs for a good dumpling.",
    memberSince: "July 2023", followers: 312, followingCount: 198, wantToTryCount: 142, streakWeeks: 94, rankOnBeli: 10690, badge: "Top 1% New York",
    scores: { r2: 10, r4: 9.4, r6: 8.8, r16: 8.1, r1: 7.5, r9: 6.2, r10: 5.1, r23: 3.9, r15: 2.8, i5: 9.6, i1: 9.0, i2: 7.8, i11: 6.4, i3: 5.5 },
    notes: {
      i5: "The cumin lamb noodles live in my head rent-free.",
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
    memberSince: "March 2024", followers: 88, followingCount: 102, wantToTryCount: 61, streakWeeks: 12, rankOnBeli: 48211,
    scores: { r3: 10, r15: 9.6, r10: 9.1, r13: 8.3, r7: 7.7, r19: 7.0, r5: 6.1, r18: 4.4, i4: 9.8, i8: 9.5, i10: 9.2, i1: 8.0, i3: 7.2 },
    notes: {
      i4: "Still the porterhouse to beat.",
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
    memberSince: "January 2023", followers: 540, followingCount: 211, wantToTryCount: 230, streakWeeks: 51, rankOnBeli: 7342, badge: "Top 5% New York",
    scores: { r11: 10, r20: 9.3, r8: 8.9, r18: 8.4, r21: 7.9, r12: 7.2, r14: 6.8, r22: 6.0, r2: 5.5, i11: 8.8, i5: 8.2, i7: 7.5, i6: 7.0, i4: 2.5 },
    notes: {
      i4: "Not a lot for a vegetarian here.",
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
    memberSince: "October 2024", followers: 45, followingCount: 60, wantToTryCount: 38, streakWeeks: 6, rankOnBeli: 90113,
    scores: { r19: 10, r5: 9.2, r1: 8.7, r17: 8.0, r24: 7.4, r6: 7.0, r9: 5.8, r3: 4.9, i6: 9.4, i10: 8.9, i1: 8.5, i9: 7.6 },
    notes: {
      i6: "Classic bagel with lox, every single Sunday.",
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
    memberSince: "May 2022", followers: 1204, followingCount: 350, wantToTryCount: 412, streakWeeks: 130, rankOnBeli: 2210, badge: "Top 1% Brooklyn",
    scores: { r14: 10, r5: 9.0, r22: 8.6, r1: 8.2, r12: 7.6, r17: 7.1, r9: 6.4, r23: 5.2, r6: 4.1, r7: 3.0, i9: 9.8, i7: 9.0, i6: 8.4, i3: 6.8, i2: 6.0 },
    notes: {
      i9: "Chocolate chip walnut. Nothing else.",
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
    memberSince: "August 2023", followers: 267, followingCount: 244, wantToTryCount: 97, streakWeeks: 40, rankOnBeli: 15877, badge: "Top 10% Queens",
    scores: { r7: 10, r21: 9.5, r20: 9.0, r3: 8.8, r24: 8.2, r12: 7.9, r4: 7.3, r11: 6.9, r8: 6.3, r10: 5.0, r13: 4.2, i12: 9.6, i8: 9.1, i5: 8.7, i2: 8.4, i11: 7.9 },
    notes: {
      i12: "Watching him make the pie is half the experience.",
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
  onboarded: false,
  memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
};

export interface FeaturedList {
  id: string;
  title: string;
  blurb: string;
  restaurantIds: string[];
}

const withTag = (tag: string) => RESTAURANTS.filter((r) => r.tags.includes(tag)).map((r) => r.id);

/** Editorial lists shown on the feed. The first is the curated list used for calibration. */
export const FEATURED_LISTS: FeaturedList[] = [
  {
    id: "recognized",
    title: "NYC's Most Recognized",
    blurb: "The places nearly every New Yorker has an opinion on. Rank the ones you know to calibrate your taste.",
    restaurantIds: RESTAURANTS.filter((r) => r.iconic).map((r) => r.id),
  },
  { id: "late-night", title: "Top NYC Late Night", blurb: "Still open when you're still hungry.", restaurantIds: withTag("Late night") },
  { id: "value", title: "Best Value in NYC", blurb: "Big flavor, small check.", restaurantIds: withTag("Great value") },
  { id: "date", title: "Date Night Spots", blurb: "Dim lights, good wine, better company.", restaurantIds: withTag("Date night") },
];

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

export const CITIES: { name: string; available: boolean; emoji: string }[] = [
  { name: "New York", available: true, emoji: "🗽" },
  { name: "Los Angeles", available: false, emoji: "🌴" },
  { name: "Chicago", available: false, emoji: "🌭" },
  { name: "San Francisco", available: false, emoji: "🌉" },
];

/** Number of places a new user rates during taste calibration. */
export const CALIBRATION_TARGET = 5;
