import { useEffect, useMemo, useState } from "react";
import { FriendPage } from "./components/FriendPage";
import { Feed } from "./components/Feed";
import { Leaderboard } from "./components/Leaderboard";
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

  let content;
  if (top?.kind === "restaurant") content = <RestaurantPage key={top.id} restaurantId={top.id} />;
  else if (top?.kind === "friend") content = <FriendPage key={top.id} friendId={top.id} />;
  else if (top?.kind === "rank") content = <RankFlow key={top.id} restaurantId={top.id} />;
  else if (top?.kind === "result") content = <RankResult restaurantId={top.id} previousScore={top.previousScore} />;
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
