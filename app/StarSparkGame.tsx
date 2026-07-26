"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type GameStatus = "ready" | "playing" | "paused" | "finished";
type MoveId = "dance" | "pose" | "spin" | "wave" | "trend";

type Metrics = {
  score: number;
  likes: number;
  views: number;
  comments: number;
  gifts: number;
};

type Reaction = {
  id: number;
  symbol: string;
  left: number;
  delay: number;
};

const ROUND_SECONDS = 45;
const BEAT_MS = 650;
const EMPTY_METRICS: Metrics = {
  score: 0,
  likes: 0,
  views: 0,
  comments: 0,
  gifts: 0,
};

const MOVES: Array<{
  id: MoveId;
  label: string;
  icon: string;
  key: string;
  hint: string;
}> = [
  { id: "dance", label: "Dance", icon: "♫", key: "1", hint: "Bounce to the beat" },
  { id: "pose", label: "Pose", icon: "✦", key: "2", hint: "Strike a star pose" },
  { id: "spin", label: "Spin", icon: "↻", key: "3", hint: "Twirl for bonus" },
  { id: "wave", label: "Wave", icon: "👋", key: "4", hint: "Greet the crowd" },
  { id: "trend", label: "Trend", icon: "🔥", key: "5", hint: "Big risk, big sparkle" },
];

const CHEERS = [
  ["MiaStar", "That move was amazing! ✨"],
  ["BeatBuddy", "Perfect timing! 🎵"],
  ["SunnySam", "Sparkle power! ⭐"],
  ["DanceDino", "Combo time! 🦕"],
  ["PixelPal", "You got this! 💜"],
  ["RainbowRay", "Best live ever! 🌈"],
];

const REACTIONS = ["💖", "⭐", "✨", "🎁", "💬", "🔥"];

function compact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function loadBestScore() {
  if (typeof window === "undefined") return 0;
  return Number(window.localStorage.getItem("starspark-best") ?? 0);
}

export default function StarSparkGame() {
  const [status, setStatus] = useState<GameStatus>("ready");
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lastMove, setLastMove] = useState<MoveId | null>(null);
  const [activeMove, setActiveMove] = useState<MoveId | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [feedback, setFeedback] = useState("Ready to shine?");
  const [beat, setBeat] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [chatOffset, setChatOffset] = useState(0);
  const [questProgress, setQuestProgress] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const lastActionRef = useRef(0);
  const beatAtRef = useRef(0);
  const reactionIdRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const usedMovesRef = useRef(new Set<MoveId>());

  const levelProgress = Math.min(100, 68 + Math.floor(metrics.score / 190));
  const trendingMove = MOVES[Math.floor((ROUND_SECONDS - timeLeft) / 7) % MOVES.length].id;
  const visibleComments = useMemo(
    () =>
      Array.from({ length: 3 }, (_, index) => {
        const position = (chatOffset + index) % CHEERS.length;
        return CHEERS[position];
      }),
    [chatOffset],
  );

  const playTone = useCallback(
    (perfect = false) => {
      if (!soundOn || typeof window === "undefined") return;
      const AudioContextClass =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      const context = audioRef.current ?? new AudioContextClass();
      audioRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(perfect ? 760 : 520, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        perfect ? 1120 : 680,
        context.currentTime + 0.08,
      );
      gain.gain.setValueAtTime(0.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.1);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.11);
    },
    [soundOn],
  );

  const burstReactions = useCallback((count: number) => {
    const next = Array.from({ length: count }, (_, index) => ({
      id: reactionIdRef.current++,
      symbol: REACTIONS[(reactionIdRef.current + index) % REACTIONS.length],
      left: 62 + Math.random() * 30,
      delay: index * 70,
    }));
    setReactions((current) => [...current.slice(-10), ...next]);
    window.setTimeout(() => {
      const ids = new Set(next.map((reaction) => reaction.id));
      setReactions((current) => current.filter((reaction) => !ids.has(reaction.id)));
    }, 1500);
  }, []);

  const startGame = useCallback(() => {
    setStatus("playing");
    setTimeLeft(ROUND_SECONDS);
    setMetrics(EMPTY_METRICS);
    setCombo(0);
    setBestCombo(0);
    setLastMove(null);
    setActiveMove(null);
    setFeedback("Catch the glowing beat!");
    setQuestProgress(0);
    setNewBest(false);
    usedMovesRef.current.clear();
    beatAtRef.current = Date.now();
    lastActionRef.current = 0;
    playTone(true);
  }, [playTone]);

  const performMove = useCallback(
    (moveId: MoveId) => {
      if (status !== "playing") return;
      const now = Date.now();
      if (now - lastActionRef.current < 180) return;
      lastActionRef.current = now;

      const distanceFromBeat = Math.abs(now - beatAtRef.current);
      const perfect = distanceFromBeat < 155;
      const switched = lastMove !== moveId;
      const nextCombo = switched ? Math.min(combo + 1, 20) : Math.max(1, combo - 1);
      const isTrending = moveId === trendingMove;
      const multiplier = Math.max(1, nextCombo);
      const scoreGain =
        34 * multiplier + (perfect ? 90 : 0) + (isTrending ? 125 : 0);
      const giftGain = nextCombo > 0 && nextCombo % 5 === 0 ? 1 : perfect && Math.random() > 0.72 ? 1 : 0;

      setCombo(nextCombo);
      setBestCombo((current) => Math.max(current, nextCombo));
      setLastMove(moveId);
      setActiveMove(moveId);
      setAnimationKey((current) => current + 1);
      setMetrics((current) => ({
        score: current.score + scoreGain,
        likes: current.likes + Math.round(scoreGain * 1.8),
        views: current.views + Math.round(scoreGain * 5.2),
        comments: current.comments + (perfect || isTrending ? 3 : 1),
        gifts: current.gifts + giftGain,
      }));

      usedMovesRef.current.add(moveId);
      setQuestProgress(Math.min(3, usedMovesRef.current.size));
      setFeedback(
        isTrending
          ? `TREND BOOST +${scoreGain}`
          : perfect
            ? `PERFECT! +${scoreGain}`
            : switched
              ? `NICE MIX! +${scoreGain}`
              : `Fresh move needed! +${scoreGain}`,
      );
      setChatOffset((current) => (current + 1) % CHEERS.length);
      burstReactions(perfect || isTrending ? 4 : 2);
      playTone(perfect || isTrending);
    },
    [burstReactions, combo, lastMove, playTone, status, trendingMove],
  );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setBestScore(loadBestScore()), 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status !== "playing") return;
    const beatTimer = window.setInterval(() => {
      beatAtRef.current = Date.now();
      setBeat(true);
      window.setTimeout(() => setBeat(false), 160);
    }, BEAT_MS);
    return () => window.clearInterval(beatTimer);
  }, [status]);

  useEffect(() => {
    if (status !== "playing" || timeLeft > 0) return;
    const finishTimer = window.setTimeout(() => {
      setStatus("finished");
      setFeedback("Sparkling finish!");
      if (metrics.score > bestScore) {
        setBestScore(metrics.score);
        setNewBest(true);
        window.localStorage.setItem("starspark-best", String(metrics.score));
      }
      burstReactions(8);
    }, 0);
    return () => window.clearTimeout(finishTimer);
  }, [bestScore, burstReactions, metrics.score, status, timeLeft]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === " " && (status === "playing" || status === "paused")) {
        event.preventDefault();
        setStatus((current) => (current === "playing" ? "paused" : "playing"));
        return;
      }
      const move = MOVES.find((item) => item.key === event.key);
      if (move) performMove(move.id);
      if (event.key === "Enter" && (status === "ready" || status === "finished")) {
        startGame();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [performMove, startGame, status]);

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-star" aria-hidden="true">★</div>
          <div>
            <p className="eyebrow">SPARK · MOVE · SHINE</p>
            <h1>StarSpark <span>Live</span></h1>
          </div>
        </div>

        <div className="profile-strip">
          <div className="avatar-chip" aria-hidden="true">Z</div>
          <div className="level-copy">
            <strong>Superstar Zoe</strong>
            <span>Level 7 · Road to 10K</span>
          </div>
          <div className="level-meter" aria-label={`${levelProgress}% to level 8`}>
            <i style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="wallet">
          <span><b>★</b> {compact(1240 + metrics.score)}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSoundOn((current) => !current)}
            aria-label={soundOn ? "Mute sound" : "Turn sound on"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
        </div>
      </header>

      <section className="game-layout">
        <div className="game-column">
          <div className={`stage-frame status-${status}`}>
            <div className="stage-room" aria-hidden="true">
              <div className="led led-one">★</div>
              <div className="led led-two">✦</div>
              <div className="led led-three">♡</div>
              <div className="poster poster-one">DREAM<br />LOUD</div>
              <div className="poster poster-two">GOOD<br />VIBES</div>
              <div className="ring-light"><i /></div>
              <div className="rug" />
            </div>

            <div className="live-row">
              <div className={`live-pill ${status === "playing" ? "is-live" : ""}`}>
                <span />
                {status === "playing" ? "LIVE" : status.toUpperCase()}
              </div>
              <div className="timer" aria-label={`${timeLeft} seconds remaining`}>
                00:{String(timeLeft).padStart(2, "0")}
              </div>
              <button
                type="button"
                className="pause-button"
                onClick={() =>
                  setStatus((current) =>
                    current === "playing" ? "paused" : current === "paused" ? "playing" : current,
                  )
                }
                disabled={status === "ready" || status === "finished"}
                aria-label={status === "paused" ? "Resume game" : "Pause game"}
              >
                {status === "paused" ? "▶" : "Ⅱ"}
              </button>
            </div>

            <div className="metrics-stack" aria-label="Live performance stats">
              <div><span>♥</span><strong>{compact(metrics.likes)}</strong><small>Likes</small></div>
              <div><span>◉</span><strong>{compact(metrics.views)}</strong><small>Views</small></div>
              <div><span>●</span><strong>{compact(metrics.comments)}</strong><small>Cheers</small></div>
              <div><span>🎁</span><strong>{compact(metrics.gifts)}</strong><small>Gifts</small></div>
            </div>

            <div className={`combo-callout ${combo >= 5 ? "on-fire" : ""}`}>
              <small>COMBO</small>
              <strong>×{Math.max(1, combo)}</strong>
              <div className="combo-meter"><i style={{ width: `${Math.min(100, combo * 5)}%` }} /></div>
            </div>

            <div className={`beat-orb ${beat ? "beat-now" : ""}`} aria-hidden="true">
              <span>BEAT</span>
            </div>

            <div className="avatar-zone">
              <div key={animationKey} className={`performer move-${activeMove ?? "idle"}`} aria-label="Zoe performing">
                <div className="hair-back" />
                <div className="head">
                  <i className="ear ear-left" />
                  <i className="ear ear-right" />
                  <div className="bangs" />
                  <span className="eye eye-left" />
                  <span className="eye eye-right" />
                  <span className="freckle">•••</span>
                  <span className="smile" />
                </div>
                <div className="neck" />
                <div className="body">
                  <span className="shirt-star">★</span>
                </div>
                <div className="arm arm-left"><i /></div>
                <div className="arm arm-right"><i /></div>
                <div className="pants" />
                <div className="leg leg-left"><i /></div>
                <div className="leg leg-right"><i /></div>
              </div>
              <div className="stage-shadow" />
            </div>

            <div className="feedback-burst" key={`${feedback}-${metrics.score}`}>
              {feedback}
            </div>

            <div className="reaction-stream" aria-hidden="true">
              {reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  style={{ left: `${reaction.left}%`, animationDelay: `${reaction.delay}ms` }}
                >
                  {reaction.symbol}
                </span>
              ))}
            </div>

            <div className="chat-stack" aria-label="Positive audience cheers">
              {visibleComments.map(([name, message], index) => (
                <div className="chat-bubble" key={`${name}-${chatOffset}-${index}`}>
                  <span>{name.slice(0, 1)}</span>
                  <p><b>{name}</b>{message}</p>
                </div>
              ))}
            </div>

            {status === "ready" && (
              <div className="start-card">
                <div className="start-spark">★</div>
                <p className="eyebrow">45-SECOND SHOW</p>
                <h2>Light up the live!</h2>
                <p>Mix your moves, catch the glowing beat, and build the biggest combo.</p>
                <button type="button" className="primary-button" onClick={startGame}>
                  Start show <span>↗</span>
                </button>
                <small>Press Enter to start · 1–5 to move</small>
              </div>
            )}

            {status === "paused" && (
              <div className="pause-card">
                <span>✦</span>
                <h2>Quick sparkle break</h2>
                <p>Your combo is safe.</p>
                <button type="button" className="primary-button" onClick={() => setStatus("playing")}>
                  Keep shining
                </button>
              </div>
            )}
          </div>

          <div className="move-deck" aria-label="Performance moves">
            {MOVES.map((move) => (
              <button
                type="button"
                key={move.id}
                className={`move-button move-button-${move.id} ${activeMove === move.id ? "active" : ""} ${trendingMove === move.id && status === "playing" ? "trending" : ""}`}
                onClick={() => performMove(move.id)}
                disabled={status !== "playing"}
                aria-label={`${move.label}: ${move.hint}. Keyboard ${move.key}`}
              >
                {trendingMove === move.id && status === "playing" && <em>HOT</em>}
                <kbd>{move.key}</kbd>
                <span>{move.icon}</span>
                <strong>{move.label}</strong>
              </button>
            ))}
          </div>

          <div className="reward-ribbon">
            <p>Performance</p>
            <div><small>Score</small><strong>{compact(metrics.score)}</strong></div>
            <div><small>Best combo</small><strong>×{bestCombo}</strong></div>
            <div><small>Beat bonus</small><strong>+{combo * 25}</strong></div>
          </div>
        </div>

        <aside className="side-panel">
          <section className="mission-card">
            <div className="section-heading">
              <span>Today&apos;s mission</span>
              <b>+250 ★</b>
            </div>
            <h2>Mix master</h2>
            <p>Use three different moves in one show.</p>
            <div className="quest-progress" aria-label={`${questProgress} of 3 moves used`}>
              {[0, 1, 2].map((step) => (
                <i key={step} className={questProgress > step ? "complete" : ""}>
                  {questProgress > step ? "✓" : step + 1}
                </i>
              ))}
              <span><i style={{ width: `${(questProgress / 3) * 100}%` }} /></span>
            </div>
          </section>

          <section className="tip-card">
            <p className="eyebrow">COMBO LAB</p>
            <h2>Keep it fresh</h2>
            <p>Switch moves on each beat. Repeating the same move cools your combo.</p>
            <div className="mini-combo">
              <span>♫</span><i>→</i><span>✦</span><i>→</i><span>👋</span>
            </div>
          </section>

          <section className="best-card">
            <span className="trophy">🏆</span>
            <div>
              <small>Your best</small>
              <strong>{compact(bestScore)}</strong>
            </div>
            <p>Score stays on this device.</p>
          </section>

          <section className="safety-card">
            <span>🛡️</span>
            <div>
              <strong>Just play. Stay safe.</strong>
              <p>No camera, microphone, chat, ads, or account needed. All cheers are game-made.</p>
            </div>
          </section>
        </aside>
      </section>

      <footer>
        <span>StarSpark Live</span>
        <p>A fictional, kid-safe creator game. Not affiliated with TikTok or any social platform.</p>
      </footer>

      {status === "finished" && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-card">
            <div className="result-rays" />
            <div className="result-trophy">★</div>
            <p className="eyebrow">{newBest ? "NEW BEST SCORE!" : "SHOW COMPLETE"}</p>
            <h2 id="result-title">{metrics.score >= 3000 ? "Total superstar!" : "Sparkling finish!"}</h2>
            <p>You mixed {questProgress} moves and reached a ×{bestCombo} combo.</p>
            <div className="result-score">{compact(metrics.score)}</div>
            <div className="result-grid">
              <div><span>♥</span><small>Likes</small><strong>{compact(metrics.likes)}</strong></div>
              <div><span>◉</span><small>Views</small><strong>{compact(metrics.views)}</strong></div>
              <div><span>🎁</span><small>Gifts</small><strong>{metrics.gifts}</strong></div>
            </div>
            <button type="button" className="primary-button" onClick={startGame}>
              Play again <span>↻</span>
            </button>
            <small>Press Enter for another show</small>
          </div>
        </div>
      )}
    </main>
  );
}
