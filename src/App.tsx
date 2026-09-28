import { useEffect, useMemo, useState } from "react";
import { FriendPage } from "./components/FriendPage";
import { Feed } from "./components/Feed";
import { Leaderboard } from "./components/Leaderboard";
import { Onboarding } from "./components/Onboarding";
import { Lists } from "./components/Lists";
import { Profile } from "./components/Profile";
import { RankFlow, RankResult } from "./components/RankFlow";
import { RestaurantPage } from "./components/RestaurantPage";
import { Search } from "./components/Search";
import { AppContext, type AppContextValue, type Screen } from "./context";
import { scoresFor } from "./lib/ranking";
import { useAppState } from "./store";

type Tab = "feed" | "lists" | "search" | "leaderboard" | "profile";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "feed", label: "Feed", icon: "🏠" },
  { id: "lists", label: "Lists", icon: "📋" },
  { id: "search", label: "Add", icon: "＋" },
  { id: "leaderboard", label: "Leaders", icon: "🏆" },
  { id: "profile", label: "Profile", icon: "🙂" },
];

export default function App() {
  const [state, dispatch] = useAppState();
  const [tab, setTab] = useState<Tab>("feed");
  const [stack, setStack] = useState<Screen[]>([]);
  const scores = useMemo(() => scoresFor(state.rankings), [state.rankings]);
  const top = stack[stack.length - 1];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [top, tab]);

  const ctx: AppContextValue = {
    state,
    dispatch,
    scores,
    push: (s) => setStack((st) => [...st, s]),
    replace: (s) => setStack((st) => [...st.slice(0, -1), s]),
    back: () => setStack((st) => st.slice(0, -1)),
  };

  if (!state.onboarded) {
    // Keep onboarding mounted under any opened screen so its progress survives "back".
    return (
      <AppContext.Provider value={ctx}>
        <div className="app">
          <main className="content" hidden={Boolean(top)}><Onboarding /></main>
          {top && <main className="content">{renderScreen(top)}</main>}
        </div>
      </AppContext.Provider>
    );
  }

  let content;
  if (top) content = renderScreen(top);
  else if (tab === "feed") content = <Feed />;
  else if (tab === "lists") content = <Lists onSearch={() => setTab("search")} />;
  else if (tab === "search") content = <Search />;
  else if (tab === "leaderboard") content = <Leaderboard />;
  else content = <Profile />;

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        <main className="content">{content}</main>
        {top?.kind !== "rank" && top?.kind !== "result" && (
          <nav className="tabbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`${tab === t.id && !top ? "on" : ""} ${t.id === "search" ? "tab-add" : ""}`}
                onClick={() => {
                  setStack([]);
                  setTab(t.id);
                }}
              >
                <span className="tab-icon">{t.icon}</span>
                <span className="tab-label">{t.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </AppContext.Provider>
  );
}

function renderScreen(top: Screen) {
  switch (top.kind) {
    case "restaurant":
      return <RestaurantPage key={top.id} restaurantId={top.id} />;
    case "friend":
      return <FriendPage key={top.id} friendId={top.id} />;
    case "rank":
      return <RankFlow key={top.id} restaurantId={top.id} />;
    case "result":
      return <RankResult restaurantId={top.id} previousScore={top.previousScore} />;
  }
}
