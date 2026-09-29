import { useState } from "react";
import { useApp } from "../context";
import { CALIBRATION_TARGET, CITIES, FRIENDS, RESTAURANTS } from "../data/seed";
import { formatMatch, friendScores } from "../lib/helpers";
import { answer, isDone, overallOrder, pivotIndex, startComparison, tie, type Comparison } from "../lib/ranking";
import { friendMatches } from "../lib/taste";
import type { Sentiment } from "../lib/types";
import { Avatar, Cover, RestaurantRow, SectionTitle, Thumb } from "./common";
import { Icon } from "./icons";
import { Versus } from "./RankFlow";
import { PickedForYou, TasteTwins, TraitsCard } from "./Taste";

const ALL_PEOPLE = FRIENDS.map((f) => f.id);

type Stage = "welcome" | "city" | "calibrate" | "reveal";

export function Onboarding() {
  const { state, dispatch } = useApp();
  const entry = state.onboardingEntry ?? "welcome";
  // "Keep calibrating" from the feed skips the landing page and city picker.
  const [stage, setStage] = useState<Stage>(entry === "welcome" ? "welcome" : state.city ? "calibrate" : "city");
  const city = state.city ?? "New York";

  if (stage === "welcome") return <Welcome onStart={() => setStage("city")} />;
  if (stage === "city")
    return (
      <CityPicker
        onPick={(c) => {
          dispatch({ type: "setCity", city: c });
          setStage("calibrate");
        }}
      />
    );
  if (stage === "calibrate") return <Calibrate city={city} redo={entry === "redo"} onDone={() => setStage("reveal")} />;
  return <Reveal />;
}

function Welcome({ onStart }: { onStart: () => void }) {
  const { dispatch } = useApp();
  const collage = RESTAURANTS.filter((r) => r.iconic).slice(0, 6);
  return (
    <div className="screen onboard welcome">
      <div className="collage" aria-hidden>
        {collage.map((r, i) => (
          <span key={r.id} className="collage-tile" style={{ animationDelay: `${i * 0.08}s` }}>
            <Thumb restaurant={r} size={96} />
          </span>
        ))}
      </div>
      <span className="wordmark big">beli</span>
      <h1 className="hero-title">Your taste, ranked.</h1>
      <p className="lead muted">
        Star ratings from strangers don't tell you much. Rank the places you've been, and get scores from people who eat like you.
      </p>
      <ul className="value-props">
        <li><span><Icon.List size={30} /></span><div><strong>Rank, don't rate</strong><p className="muted small">Compare places head-to-head. Your scores are worked out for you.</p></div></li>
        <li><span><Icon.Users size={30} /></span><div><strong>Find your taste twins</strong><p className="muted small">See whose taste matches yours, and why.</p></div></li>
        <li><span><Icon.Bookmark size={28} /></span><div><strong>Never lose a rec</strong><p className="muted small">Save places and get picks tuned to you.</p></div></li>
      </ul>
      <div className="onboard-cta">
        <button className="btn primary wide" onClick={onStart}>Get started</button>
        <p className="muted small center-text">Takes about a minute</p>
        <button className="link center" onClick={() => dispatch({ type: "finishOnboarding", follow: [] })}>
          I'll look around first
        </button>
      </div>
    </div>
  );
}

function CityPicker({ onPick }: { onPick: (city: string) => void }) {
  return (
    <div className="screen onboard">
      <StepDots current={0} />
      <h1 className="hero-title">Where do you eat?</h1>
      <p className="muted">We'll start you with places locals know.</p>
      <div className="stack">
        {CITIES.map((c) => (
          <button key={c.name} className="city" disabled={!c.available} onClick={() => onPick(c.name)}>
            <span className="city-emoji">{c.emoji}</span>
            <span className="grow">
              <strong>{c.name}</strong>
              {!c.available && <span className="muted small block">Coming soon</span>}
            </span>
            {c.available && <span className="muted">›</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

type CalStep =
  | { kind: "ask" }
  | { kind: "compare"; sentiment: Sentiment; list: string[]; comparison: Comparison };

const ANSWERS: { value: Sentiment; label: string; face: string }[] = [
  { value: "liked", label: "Loved it", face: "😍" },
  { value: "fine", label: "It was fine", face: "😐" },
  { value: "disliked", label: "Not for me", face: "😣" },
];

function Calibrate({ city, redo, onDone }: { city: string; redo: boolean; onDone: () => void }) {
  const { state, dispatch, scores } = useApp();
  // Resuming skips places you've already ranked and counts them toward the 5; redo re-asks all of them.
  const [pool] = useState(() => RESTAURANTS.filter((r) => r.iconic && r.city === city && (redo || !(r.id in scores))));
  const [cursor, setCursor] = useState(0);
  const [rated, setRated] = useState(redo ? 0 : Math.min(Object.keys(scores).length, CALIBRATION_TARGET - 1));
  const [step, setStep] = useState<CalStep>({ kind: "ask" });

  const current = pool[cursor];
  const remaining = pool.length - cursor - 1;

  function next(ratedNow: boolean) {
    const count = rated + (ratedNow ? 1 : 0);
    setRated(count);
    setStep({ kind: "ask" });
    if (count >= CALIBRATION_TARGET || cursor + 1 >= pool.length) onDone();
    else setCursor(cursor + 1);
  }

  function place(sentiment: Sentiment, index: number) {
    dispatch({ type: "rank", restaurantId: current.id, sentiment, index, note: "", tags: [], silent: true });
    next(true);
  }

  function chooseSentiment(sentiment: Sentiment) {
    // Re-calibrating a place you already ranked: compare against the others only.
    const list = state.rankings[sentiment].filter((id) => id !== current.id);
    const comparison = startComparison(list.length);
    if (isDone(comparison)) place(sentiment, 0);
    else setStep({ kind: "compare", sentiment, list, comparison });
  }

  function advance(c: Comparison) {
    if (step.kind !== "compare") return;
    if (isDone(c)) place(step.sentiment, c.lo);
    else setStep({ ...step, comparison: c });
  }

  const header = (
    <>
      <StepDots current={1} />
      <div className="cal-top">
        <div className="cal-progress">
          {Array.from({ length: CALIBRATION_TARGET }, (_, i) => (
            <span key={i} className={i < rated ? "done" : i === rated ? "now" : ""} />
          ))}
        </div>
        {/* Leaving early keeps what's ranked; the feed card picks up from here. */}
        <button className="link" onClick={() => dispatch({ type: "finishOnboarding", follow: [] })}>Finish later</button>
      </div>
    </>
  );

  if (step.kind === "compare") {
    const other = RESTAURANTS.find((r) => r.id === step.list[pivotIndex(step.comparison)])!;
    return (
      <div className="screen onboard">
        {header}
        <div className="flow-title">
          <h2>Which did you like more?</h2>
          <p className="muted small">This is how Beli works: comparisons, not stars.</p>
        </div>
        <Versus
          fresh={current}
          other={other}
          otherLabel={`You: ${scores[other.id]?.toFixed(1)}`}
          onPick={(freshIsBetter) => advance(answer(step.comparison, freshIsBetter))}
          onTie={() => advance(tie(step.comparison))}
        />
      </div>
    );
  }

  const knownBy = friendScores(current.id, ALL_PEOPLE);

  return (
    <div className="screen onboard">
      {header}
      {rated === 0 && cursor === 0 && (
        <p className="cal-intro">
          <strong>Let's calibrate your taste.</strong> Tell us about {CALIBRATION_TARGET} places most New Yorkers know. Haven't been? Skip it.
        </p>
      )}
      <div className="cal-card" key={current.id}>
        <Cover restaurant={current} height={180} />
        <div className="cal-body">
          <p className="muted small">{current.cuisine} · {current.neighborhood}</p>
          <h2 className="tight">Been to {current.name}?</h2>
          <p className="muted">{current.blurb}</p>
          {knownBy.length > 0 && (
            <p className="known-by small">
              <span className="avatars">{knownBy.slice(0, 4).map((k) => <Avatar key={k.friend.id} emoji={k.friend.avatar} size={22} />)}</span>
              {knownBy.length} people on Beli have ranked this
            </p>
          )}
        </div>
      </div>
      <div className="answers">
        {ANSWERS.map((a) => (
          <button key={a.value} className={`answer sentiment-${a.value}`} onClick={() => chooseSentiment(a.value)}>
            <span className="answer-face">{a.face}</span>
            {a.label}
          </button>
        ))}
      </div>
      <button className="btn skip" onClick={() => next(false)}>
        Haven't been · {remaining > 0 ? `${remaining} more to pick from` : "last one"}
      </button>
      <LiveMatches />
    </div>
  );
}

/** Shows the taste graph forming in real time as you answer. */
function LiveMatches() {
  const { scores } = useApp();
  const matches = friendMatches(scores).slice(0, 3);
  return (
    <div className="live-matches">
      {matches.length === 0 ? (
        <span className="muted small">Your taste matches will appear here as you go.</span>
      ) : (
        <>
          <span className="muted small">Taste matches so far</span>
          <span className="live-row">
            {matches.map((m) => (
              <span key={m.friend.id} className="live-chip">
                <Avatar emoji={m.friend.avatar} size={22} /> {formatMatch(m.match)}
              </span>
            ))}
          </span>
        </>
      )}
    </div>
  );
}

function Reveal() {
  const { state, dispatch, scores, push } = useApp();
  const matches = friendMatches(scores);
  // Pre-select strong matches you don't already follow.
  const [follow, setFollow] = useState<string[]>(
    matches.filter((m) => m.match >= 70 && !state.following.includes(m.friend.id)).slice(0, 2).map((m) => m.friend.id),
  );
  const order = overallOrder(state.rankings);
  const finish = () => dispatch({ type: "finishOnboarding", follow });

  if (order.length === 0) {
    return (
      <div className="screen onboard reveal">
        <span className="reveal-icon">🍽️</span>
        <h1 className="hero-title">No worries!</h1>
        <p className="lead muted">You can rank places whenever you visit them. Your taste profile builds as you go.</p>
        <button className="btn primary wide" onClick={finish}>Start exploring</button>
      </div>
    );
  }

  return (
    <div className="screen onboard reveal">
      <StepDots current={2} />
      <span className="reveal-icon">✨</span>
      <h1 className="hero-title">Here's your taste</h1>
      <p className="muted center-text">
        Based on {order.length} {order.length === 1 ? "place" : "places"}. It gets sharper with every place you rank.
      </p>

      <TraitsCard />

      <SectionTitle>Your list so far</SectionTitle>
      <div className="stack">
        {order.map((id, i) => (
          <RestaurantRow key={id} restaurant={RESTAURANTS.find((r) => r.id === id)!} rank={i + 1} score={scores[id]} onClick={() => push({ kind: "restaurant", id })} />
        ))}
      </div>

      <SectionTitle>People who eat like you</SectionTitle>
      <TasteTwins selected={follow} onToggle={(id) => setFollow((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))} />

      <SectionTitle>Picked for you</SectionTitle>
      <PickedForYou />

      <div className="onboard-cta sticky">
        <button className="btn primary wide" onClick={finish}>
          Start exploring{follow.length > 0 ? ` · follow ${follow.length}` : ""}
        </button>
      </div>
    </div>
  );
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="step-dots" aria-label={`Step ${current + 1} of 3`}>
      {["City", "Calibrate", "Your taste"].map((label, i) => (
        <span key={label} className={i <= current ? "on" : ""}>{label}</span>
      ))}
    </div>
  );
}
