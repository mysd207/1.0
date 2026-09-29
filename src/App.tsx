import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "./components/common";
import { Feed } from "./components/Feed";
import { FeaturedListPage } from "./components/FeaturedListPage";
import { FriendPage } from "./components/FriendPage";
import { Icon } from "./components/icons";
import { Leaderboard } from "./components/Leaderboard";
import { Lists } from "./components/Lists";
import { Onboarding } from "./components/Onboarding";
import { Profile } from "./components/Profile";
import { RankFlow, RankResult } from "./components/RankFlow";
import { RestaurantPage } from "./components/RestaurantPage";
import { Search } from "./components/Search";
import { AppContext, type AppContextValue, type ListTab, type Screen, type Tab } from "./context";
import { scoresFor } from "./lib/ranking";
import { useAppState } from "./store";

const TABS: { id: Tab; label: string }[] = [
  { id: "feed", label: "Feed" },
  { id: "lists", label: "Your Lists" },
  { id: "search", label: "Search" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "profile", label: "Profile" },
];

function TabIcon({ id }: { id: Tab }) {
  switch (id) {
    case "feed":
      return <Icon.Feed size={28} />;
    case "lists":
      return <Icon.List size={28} />;
    case "search":
      return <span className="tab-plus"><Icon.Plus size={24} /></span>;
    case "leaderboard":
      return <Icon.Trophy size={28} />;
    case "profile":
      return <Avatar emoji="🙂" size={30} />;
  }
}

export default function App() {
  const [state, dispatch] = useAppState();
  const [tab, setTab] = useState<Tab>("feed");
  const [listTab, setListTab] = useState<ListTab>("been");
  const [stack, setStack] = useState<Screen[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
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
    goTab: (t, lt) => {
      setStack([]);
      setTab(t);
      if (lt) setListTab(lt);
    },
    toast: (message) => {
      setToastMsg(message);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
    },
  };

  const toast = toastMsg && <div className="toast" role="status">{toastMsg}</div>;

  if (!state.onboarded) {
    // Keep onboarding mounted under any opened screen so its progress survives "back".
    return (
      <AppContext.Provider value={ctx}>
        <div className="app">
          <main className="content" hidden={Boolean(top)}><Onboarding /></main>
          {top && <main className="content">{renderScreen(top)}</main>}
          {toast}
        </div>
      </AppContext.Provider>
    );
  }

  let content;
  if (top) content = renderScreen(top);
  else if (tab === "feed") content = <Feed />;
  else if (tab === "lists") content = <Lists key={listTab} initialTab={listTab} />;
  else if (tab === "search") content = <Search />;
  else if (tab === "leaderboard") content = <Leaderboard />;
  else content = <Profile />;

  return (
    <AppContext.Provider value={ctx}>
      <div className="app">
        <main className="content">{content}</main>
        {toast}
        {top?.kind !== "rank" && top?.kind !== "result" && (
          <nav className="tabbar">
            {TABS.map((t) => (
              <button key={t.id} className={tab === t.id && !top ? "on" : ""} onClick={() => ctx.goTab(t.id)}>
                <span className="tab-icon"><TabIcon id={t.id} /></span>
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
      return <FriendPage key={top.id} friendId={top.id} initialTab={top.tab} />;
    case "rank":
      return <RankFlow key={top.id} restaurantId={top.id} />;
    case "result":
      return <RankResult restaurantId={top.id} previousScore={top.previousScore} />;
    case "list":
      return <FeaturedListPage key={top.id} listId={top.id} />;
  }
}
