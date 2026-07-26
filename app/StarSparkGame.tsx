"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ZoeCharacter from "./ZoeCharacter";

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

type LevelConfig = {
  level: number;
  title: string;
  target: number;
  comboTarget: number;
  moveTarget: number;
  roundSeconds: number;
  rewardStars: number;
  rewardFans: number;
};

type RunReward = {
  cleared: boolean;
  rating: number;
  stars: number;
  fans: number;
  level: number;
  title: string;
  target: number;
};

const LEVELS: LevelConfig[] = [
  { level: 1, title: "First Spark", target: 1_500, comboTarget: 4, moveTarget: 2, roundSeconds: 35, rewardStars: 75, rewardFans: 180 },
  { level: 2, title: "Beat Builder", target: 2_800, comboTarget: 5, moveTarget: 3, roundSeconds: 36, rewardStars: 90, rewardFans: 260 },
  { level: 3, title: "Mix Master", target: 4_500, comboTarget: 7, moveTarget: 3, roundSeconds: 38, rewardStars: 110, rewardFans: 380 },
  { level: 4, title: "Trend Chaser", target: 6_500, comboTarget: 8, moveTarget: 4, roundSeconds: 39, rewardStars: 130, rewardFans: 520 },
  { level: 5, title: "Crowd Favorite", target: 9_000, comboTarget: 10, moveTarget: 4, roundSeconds: 40, rewardStars: 155, rewardFans: 700 },
  { level: 6, title: "Viral Energy", target: 12_000, comboTarget: 12, moveTarget: 4, roundSeconds: 41, rewardStars: 180, rewardFans: 920 },
  { level: 7, title: "Superstar", target: 15_500, comboTarget: 14, moveTarget: 5, roundSeconds: 42, rewardStars: 210, rewardFans: 1_200 },
  { level: 8, title: "Spotlight Pro", target: 19_500, comboTarget: 16, moveTarget: 5, roundSeconds: 43, rewardStars: 245, rewardFans: 1_550 },
  { level: 9, title: "Creator Icon", target: 24_000, comboTarget: 18, moveTarget: 5, roundSeconds: 44, rewardStars: 285, rewardFans: 2_000 },
  { level: 10, title: "StarSpark Legend", target: 30_000, comboTarget: 20, moveTarget: 5, roundSeconds: 45, rewardStars: 350, rewardFans: 2_600 },
];

const PROFILE_KEY = "starspark-profile-v2";
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

function loadProfile() {
  const fallback = { level: 1, stars: 250, fans: 0, bestScore: loadBestScore() };
  if (typeof window === "undefined") return fallback;
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROFILE_KEY) ?? "");
    return {
      level: Math.min(LEVELS.length, Math.max(1, Number(saved.level) || 1)),
      stars: Math.max(0, Number(saved.stars) || fallback.stars),
      fans: Math.max(0, Number(saved.fans) || 0),
      bestScore: Math.max(0, Number(saved.bestScore) || fallback.bestScore),
    };
  } catch {
    return fallback;
  }
}

function saveProfile(level: number, stars: number, fans: number, bestScore: number) {
  window.localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({ level, stars, fans, bestScore }),
  );
  window.localStorage.setItem("starspark-best", String(bestScore));
}

export default function StarSparkGame() {
  const [status, setStatus] = useState<GameStatus>("ready");
  const [playerLevel, setPlayerLevel] = useState(1);
  const [stars, setStars] = useState(250);
  const [fans, setFans] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[0].roundSeconds);
  const [metrics, setMetrics] = useState<Metrics>(EMPTY_METRICS);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [perfects, setPerfects] = useState(0);
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
  const [runReward, setRunReward] = useState<RunReward | null>(null);
  const lastActionRef = useRef(0);
  const beatAtRef = useRef(0);
  const checkpointRef = useRef(0);
  const reactionIdRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const usedMovesRef = useRef(new Set<MoveId>());

  const currentLevel = LEVELS[playerLevel - 1] ?? LEVELS[0];
  const levelProgress = Math.min(100, Math.round((metrics.score / currentLevel.target) * 100));
  const beatMs = Math.max(535, 690 - (playerLevel - 1) * 17);
  const trendingMove = MOVES[Math.floor((currentLevel.roundSeconds - timeLeft) / 7) % MOVES.length].id;
  const comboGoalMet = bestCombo >= currentLevel.comboTarget;
  const mixGoalMet = questProgress >= currentLevel.moveTarget;
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
    setTimeLeft(currentLevel.roundSeconds);
    setMetrics(EMPTY_METRICS);
    setCombo(0);
    setBestCombo(0);
    setPerfects(0);
    setLastMove(null);
    setActiveMove(null);
    setFeedback(`Target: ${compact(currentLevel.target)} points`);
    setQuestProgress(0);
    setNewBest(false);
    setRunReward(null);
    usedMovesRef.current.clear();
    checkpointRef.current = 0;
    beatAtRef.current = Date.now();
    lastActionRef.current = 0;
    playTone(true);
  }, [currentLevel, playTone]);

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
      const nextScore = metrics.score + scoreGain;
      const nextCheckpoint = Math.min(
        3,
        Math.floor((nextScore / currentLevel.target) * 3),
      );
      const hitCheckpoint = nextCheckpoint > checkpointRef.current;
      const giftGain =
        (nextCombo > 0 && nextCombo % 5 === 0 ? 1 : 0) +
        (hitCheckpoint ? 1 : 0);
      checkpointRef.current = nextCheckpoint;

      setCombo(nextCombo);
      setBestCombo((current) => Math.max(current, nextCombo));
      if (perfect) setPerfects((current) => current + 1);
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
      setQuestProgress(usedMovesRef.current.size);
      setFeedback(
        hitCheckpoint && nextCheckpoint < 3
          ? `CHECKPOINT ${nextCheckpoint}/3 · GIFT!`
          : hitCheckpoint
            ? "TARGET REACHED! ★"
            : isTrending
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
    [burstReactions, combo, currentLevel.target, lastMove, metrics.score, playTone, status, trendingMove],
  );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const profile = loadProfile();
      setPlayerLevel(profile.level);
      setStars(profile.stars);
      setFans(profile.fans);
      setBestScore(profile.bestScore);
      setTimeLeft(LEVELS[profile.level - 1].roundSeconds);
    }, 0);
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
    }, beatMs);
    return () => window.clearInterval(beatTimer);
  }, [beatMs, status]);

  useEffect(() => {
    if (status !== "playing" || timeLeft > 0) return;
    const finishTimer = window.setTimeout(() => {
      const cleared = metrics.score >= currentLevel.target;
      const rating = cleared
        ? 1 + Number(comboGoalMet) + Number(mixGoalMet)
        : 0;
      const earnedStars = cleared ? currentLevel.rewardStars * rating : 0;
      const earnedFans = cleared ? currentLevel.rewardFans * rating : 0;
      const nextLevel = cleared
        ? Math.min(LEVELS.length, playerLevel + 1)
        : playerLevel;
      const nextStars = stars + earnedStars;
      const nextFans = fans + earnedFans;
      const nextBest = Math.max(bestScore, metrics.score);

      setStatus("finished");
      setFeedback(cleared ? "Level cleared!" : "So close—try the target again!");
      setRunReward({
        cleared,
        rating,
        stars: earnedStars,
        fans: earnedFans,
        level: currentLevel.level,
        title: currentLevel.title,
        target: currentLevel.target,
      });
      if (metrics.score > bestScore) {
        setNewBest(true);
      }
      setBestScore(nextBest);
      setStars(nextStars);
      setFans(nextFans);
      setPlayerLevel(nextLevel);
      saveProfile(nextLevel, nextStars, nextFans, nextBest);
      burstReactions(cleared ? 10 : 5);
    }, 0);
    return () => window.clearTimeout(finishTimer);
  }, [
    bestScore,
    burstReactions,
    comboGoalMet,
    currentLevel,
    fans,
    metrics.score,
    mixGoalMet,
    playerLevel,
    stars,
    status,
    timeLeft,
  ]);

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
            <span>Level {currentLevel.level} · {currentLevel.title}</span>
          </div>
          <div className="level-meter" aria-label={`${levelProgress}% of the current target`}>
            <i style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="wallet">
          <span><b>★</b> {compact(stars)}</span>
          <span className="fan-wallet">♥ {compact(fans)}</span>
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

            <div className={`target-hud ${levelProgress >= 100 ? "complete" : ""}`}>
              <div>
                <span>LEVEL {currentLevel.level} TARGET</span>
                <b>{compact(metrics.score)} / {compact(currentLevel.target)}</b>
              </div>
              <div className="target-meter" aria-label={`${levelProgress}% of target reached`}>
                <i style={{ width: `${levelProgress}%` }} />
                <em style={{ left: "33.33%" }} />
                <em style={{ left: "66.66%" }} />
              </div>
            </div>

            <div className={`beat-orb ${beat ? "beat-now" : ""}`} aria-hidden="true">
              <span>BEAT</span>
            </div>

            <div className="avatar-zone">
              <div key={animationKey} className={`performer move-${activeMove ?? "idle"}`} aria-label="Zoe performing">
                <ZoeCharacter />
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
                <p className="eyebrow">LEVEL {currentLevel.level} · {currentLevel.title}</p>
                <h2>Reach {compact(currentLevel.target)}</h2>
                <p>
                  Build a ×{currentLevel.comboTarget} combo and mix {currentLevel.moveTarget} moves
                  for all three stars.
                </p>
                <div className="reward-preview">
                  <span>★ {compact(currentLevel.rewardStars)}–{compact(currentLevel.rewardStars * 3)}</span>
                  <span>♥ {compact(currentLevel.rewardFans)}–{compact(currentLevel.rewardFans * 3)}</span>
                  <span>{currentLevel.roundSeconds}s show</span>
                </div>
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
            <p>Level {currentLevel.level}</p>
            <div><small>Target</small><strong>{levelProgress}%</strong></div>
            <div><small>Best combo</small><strong>×{bestCombo}</strong></div>
            <div><small>Perfect beats</small><strong>{perfects}</strong></div>
          </div>
        </div>

        <aside className="side-panel">
          <section className="mission-card">
            <div className="section-heading">
              <span>Level {currentLevel.level} goals</span>
              <b>Up to {compact(currentLevel.rewardStars * 3)} ★</b>
            </div>
            <h2>{currentLevel.title}</h2>
            <div className="goal-list">
              <div className={metrics.score >= currentLevel.target ? "complete" : ""}>
                <i>{metrics.score >= currentLevel.target ? "✓" : "1"}</i>
                <span><b>Score target</b><small>{compact(metrics.score)} / {compact(currentLevel.target)}</small></span>
              </div>
              <div className={comboGoalMet ? "complete" : ""}>
                <i>{comboGoalMet ? "✓" : "2"}</i>
                <span><b>Combo target</b><small>×{bestCombo} / ×{currentLevel.comboTarget}</small></span>
              </div>
              <div className={mixGoalMet ? "complete" : ""}>
                <i>{mixGoalMet ? "✓" : "3"}</i>
                <span><b>Move variety</b><small>{questProgress} / {currentLevel.moveTarget} moves</small></span>
              </div>
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

      {status === "finished" && runReward && (
        <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title">
          <div className="result-card">
            <div className="result-rays" />
            <div className="result-trophy">{runReward.cleared ? "★" : "✦"}</div>
            <p className="eyebrow">
              {newBest ? "NEW BEST · " : ""}
              LEVEL {runReward.level} · {runReward.title}
            </p>
            <h2 id="result-title">{runReward.cleared ? "Level cleared!" : "Almost there!"}</h2>
            <p>
              {runReward.cleared
                ? `Target passed with a ×${bestCombo} combo and ${questProgress} different moves.`
                : `${compact(runReward.target - metrics.score)} more points will unlock the next level.`}
            </p>
            <div className="result-stars" aria-label={`${runReward.rating} of 3 stars earned`}>
              {[1, 2, 3].map((star) => (
                <span key={star} className={runReward.rating >= star ? "earned" : ""}>★</span>
              ))}
            </div>
            <div className="result-score">{compact(metrics.score)}</div>
            <div className="result-progress">
              <i style={{ width: `${Math.min(100, (metrics.score / runReward.target) * 100)}%` }} />
            </div>
            <small className="result-target">Target {compact(runReward.target)}</small>
            <div className="result-grid">
              <div><span>♥</span><small>Likes</small><strong>{compact(metrics.likes)}</strong></div>
              <div><span>✦</span><small>Perfects</small><strong>{perfects}</strong></div>
              <div><span>🎁</span><small>Gifts</small><strong>{metrics.gifts}</strong></div>
            </div>
            {runReward.cleared && (
              <div className="reward-payout">
                <span><b>+{compact(runReward.stars)}</b> stars</span>
                <span><b>+{compact(runReward.fans)}</b> fans</span>
              </div>
            )}
            <button type="button" className="primary-button" onClick={startGame}>
              {runReward.cleared && runReward.level < LEVELS.length ? "Next level" : "Play again"}
              <span>↗</span>
            </button>
            <small>Press Enter to keep shining</small>
          </div>
        </div>
      )}
    </main>
  );
}
