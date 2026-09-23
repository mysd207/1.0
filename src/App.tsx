import { useState } from "react";
import { RankFlow } from "./components/RankFlow";
import { RestaurantSheet } from "./components/RestaurantSheet";
import { FeedView, LeaderboardView, ListsView, ProfileView, SearchView } from "./components/views";
import { scoresFor } from "./lib/ranking";
import { useAppState } from "./store";

type Tab = "feed" | "lists" | "search" | "leaderboard" | "profile";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "feed", label: "Feed", icon: "🏠" },
  { id: "lists", label: "Lists", icon: "📋" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "leaderboard", label: "Ranks", icon: "🏆" },
  { id: "profile", label: "Profile", icon: "🙂" },
];

type Overlay = { kind: "detail"; id: string } | { kind: "rank"; id: string } | null;

export default function App() {
  const [state, dispatch] = useAppState();
  const [tab, setTab] = useState<Tab>("feed");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const scores = scoresFor(state.rankings);
  const open = (id: string) => setOverlay({ kind: "detail", id });

  return (
    <div className="app">
      <main className="content">
        {overlay?.kind === "rank" ? (
          <RankFlow
            key={overlay.id}
            restaurantId={overlay.id}
            rankings={state.rankings}
            initialNote={state.visits[overlay.id]?.note ?? ""}
            onCancel={() => setOverlay({ kind: "detail", id: overlay.id })}
            onDone={(sentiment, index, note) => {
              dispatch({ type: "rank", restaurantId: overlay.id, sentiment, index, note });
              setOverlay({ kind: "detail", id: overlay.id });
            }}
          />
        ) : overlay?.kind === "detail" ? (
          <RestaurantSheet
            restaurantId={overlay.id}
            myScore={scores[overlay.id]}
            visit={state.visits[overlay.id]}
            wantToTry={state.wantToTry.includes(overlay.id)}
            onClose={() => setOverlay(null)}
            onRank={() => setOverlay({ kind: "rank", id: overlay.id })}
            onUnrank={() => dispatch({ type: "unrank", restaurantId: overlay.id })}
            onToggleWantToTry={() => dispatch({ type: "toggleWantToTry", restaurantId: overlay.id })}
          />
        ) : tab === "feed" ? (
          <FeedView state={state} onOpen={open} />
        ) : tab === "lists" ? (
          <ListsView state={state} onOpen={open} />
        ) : tab === "search" ? (
          <SearchView state={state} onOpen={open} />
        ) : tab === "leaderboard" ? (
          <LeaderboardView state={state} />
        ) : (
          <ProfileView state={state} onOpen={open} onReset={() => dispatch({ type: "reset" })} />
        )}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id && !overlay ? "on" : ""}
            onClick={() => {
              setOverlay(null);
              setTab(t.id);
            }}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
