# Beli prototype

A mobile-first web prototype of a Beli-style restaurant ranking app, built with React, TypeScript and Vite.

<p>
  <img src="docs/feed.png" width="200" alt="Feed" />
  <img src="docs/compare.png" width="200" alt="Pairwise comparison" />
  <img src="docs/result.png" width="200" alt="Ranking result" />
</p>
<p>
  <img src="docs/map.png" width="200" alt="Map view" />
  <img src="docs/friend.png" width="200" alt="Friend profile with taste match" />
  <img src="docs/profile.png" width="200" alt="Profile and yearly goal" />
</p>

## Taste calibration onboarding

New users don't start from a blank slate. On first launch they:

1. **Land** on a welcome page that explains the pitch: rank, don't rate; find your taste twins; never lose a rec.
2. **Pick a city.** New York is live, and others are marked "coming soon".
3. **Calibrate:** rate 5 places from a curated *most recognized* list for that city (Katz's, Joe's Pizza, Peter Luger…). *Haven't been?* skips to the next one. Answers use the real head-to-head ranking, so onboarding also teaches how the app works. A live strip shows taste matches forming as you go.
4. **See their taste profile:** traits (favorite cuisines, price sweet spot, vibe), the calibrated list with scores, *People who eat like you* with a plain-language reason for each match %, and *Picked for you* recs that say whose taste backs each one.

<p>
  <img src="docs/onboarding-welcome.png" width="200" alt="Welcome page" />
  <img src="docs/onboarding-calibrate.png" width="200" alt="Calibration" />
  <img src="docs/onboarding-reveal.png" width="200" alt="Taste profile reveal" />
</p>

How it works under the hood (`src/lib/taste.ts`):

- **Taste match** measures how closely you agree on places you've both ranked. It is pulled toward 50% when you share only a few places, so a single place in common can't produce a 99% match.
- **Predicted scores** (*Recs* tab and *Picked for you*) weight each person's score by how well their taste matches yours. Each pick credits the person pulling the prediction up the most.
- Calibration rankings don't post to the feed. *Profile → Redo taste calibration* runs the flow again.

## How ranking works

Instead of giving a star rating, you rank each new place against the places you've already ranked:

1. **Pick a sentiment:** *I liked it*, *It was fine*, or *I didn't like it*. Each maps to a score band (6.7–10, 3.3–6.6, 0–3.2).
2. **Compare head-to-head:** "Which do you prefer?" A binary search over that band's list finds the new place's slot in about log₂(n) questions. *Too tough to decide* places it next to the current comparison.
3. **Get a score:** places are spread evenly through their band by rank, so your favorite is always 10.0 and scores update as your list grows.

The logic is in `src/lib/ranking.ts`, with unit tests in `src/lib/ranking.test.ts`.

## Features

- **Feed:** a *Trending with friends* carousel, *People to follow*, and an activity feed with likes, one-tap save and one-tap rank.
- **Ranking flow:** sentiment, tags (such as *Date night* or *Great value*), notes, then head-to-head comparisons with a progress bar. It ends on a results screen with confetti showing your score, where the place lands in your list, and progress toward your goal.
- **Restaurant page:** cover art, description, tags, your score vs. friends' average, what each friend thought, your own visit notes, and *You might also like*.
- **Lists:** *Been* (grouped by Liked, Fine and Didn't like), *Want to Try*, and *Recs* (predicted scores weighted by taste match, with who backs each pick). There's also a **map view** of NYC with pins colored by your score and filters.
- **Search:** by name, cuisine, neighborhood or tag, with price and cuisine filter chips. Results are sorted by friends' scores.
- **Friend profiles:** follow and unfollow, see their ranked list next to your own scores, and a **taste match %**.
- **Leaderboard:** *Most places* and *Taste match* boards.
- **Profile:** taste profile and taste twins, yearly goal ring (adjustable), average score, number of cuisines and neighborhoods, top-cuisine bars, and your top 5.
- Light and dark mode.

Data is fictional seed data (`src/data/seed.ts`), and cover images are generated gradients. Your data is saved to `localStorage`; use *Profile → Reset demo data* to clear it.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run build      # typecheck + production build
```

## Possible next steps

- A real backend (auth, a real friend graph, shared data)
- Real restaurant data and photos (for example, Google Places)
- Photo uploads on reviews
- Multiple cities, and a real, zoomable map (for example, Mapbox or Leaflet)
