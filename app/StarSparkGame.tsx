"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ZoeCharacter, { type OutfitId } from "./ZoeCharacter";

type GameStatus = "ready" | "playing" | "paused" | "finished";
type AppScreen = "splash" | "customize" | "profile" | "live";
type MoveId = "dance" | "pose" | "spin" | "wave" | "trend" | "silly" | "robot";

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

type LiveComment = {
  id: number;
  name: string;
  message: string;
  tone: "positive" | "negative";
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
  moderationBonus: number;
};

type Milestone = {
  id: string;
  metric: "views" | "likes";
  value: number;
  stars: number;
  reward: string;
};

type SavedPost = {
  id: string;
  outfit: OutfitId;
  views: number;
  likes: number;
  score: number;
  level: number;
  title: string;
  cleared: boolean;
  createdAt: number;
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
  { id: "silly", label: "Silly", icon: "🤪", key: "6", hint: "A goofy view booster" },
  { id: "robot", label: "Robot", icon: "🤖", key: "7", hint: "Funny robot wobble" },
];

const POSITIVE_COMMENTS = [
  ["MiaStar", "That move was amazing! ✨"],
  ["BeatBuddy", "Perfect timing! 🎵"],
  ["SunnySam", "Sparkle power! ⭐"],
  ["DanceDino", "Combo time! 🦕"],
  ["PixelPal", "You got this! 💜"],
  ["RainbowRay", "Best live ever! 🌈"],
] as const;

const NEGATIVE_COMMENTS = [
  ["GrumpyGrape", "That move was a little boring."],
  ["SleepySloth", "This live is kind of meh."],
  ["ScrollScout", "Do something funny or I’m scrolling."],
  ["FussyFox", "Not your best move."],
] as const;

const OUTFITS: Array<{
  id: OutfitId;
  name: string;
  icon: string;
  colors: [string, string];
  milestone?: string;
}> = [
  { id: "star", name: "Star Pop", icon: "⭐", colors: ["#f8f1ff", "#ad38b5"] },
  { id: "bubble", name: "Bubble Beat", icon: "🫧", colors: ["#ffb6e4", "#27cbd5"] },
  { id: "sunset", name: "Sunset Jam", icon: "🌅", colors: ["#ffd86a", "#ed477e"], milestone: "views-100" },
  { id: "neon", name: "Neon Night", icon: "⚡", colors: ["#67ffe5", "#5847dc"], milestone: "likes-100" },
  { id: "galaxy", name: "Galaxy Glow", icon: "🌌", colors: ["#e247c7", "#221b5f"], milestone: "views-1000" },
];

const MILESTONES: Milestone[] = [
  { id: "views-10", metric: "views", value: 10, stars: 25, reward: "Rookie badge" },
  { id: "likes-10", metric: "likes", value: 10, stars: 25, reward: "Heart sticker" },
  { id: "views-100", metric: "views", value: 100, stars: 75, reward: "Sunset Jam outfit" },
  { id: "likes-100", metric: "likes", value: 100, stars: 75, reward: "Neon Night outfit" },
  { id: "views-1000", metric: "views", value: 1_000, stars: 200, reward: "Galaxy Glow outfit" },
  { id: "likes-1000", metric: "likes", value: 1_000, stars: 250, reward: "Creator crown" },
];

const REACTIONS = ["💖", "⭐", "✨", "🎁", "💬", "🔥"];
const BACKGROUND_TRACKS = [
  { title: "Bubble Pop Loop", src: "/music/bubble-pop-loop.mp3" },
  { title: "Sylhet Bangladesh", src: "/music/sylhet-bangladesh.mp3" },
] as const;

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
  const fallback = {
    level: 1,
    stars: 250,
    fans: 0,
    bestScore: loadBestScore(),
    careerViews: 0,
    careerLikes: 0,
    milestones: [] as string[],
    outfit: "star" as OutfitId,
    creatorName: "Zoe",
    posts: [] as SavedPost[],
  };
  if (typeof window === "undefined") return fallback;
  try {
    const saved = JSON.parse(window.localStorage.getItem(PROFILE_KEY) ?? "");
    return {
      level: Math.min(LEVELS.length, Math.max(1, Number(saved.level) || 1)),
      stars: Math.max(0, Number(saved.stars) || fallback.stars),
      fans: Math.max(0, Number(saved.fans) || 0),
      bestScore: Math.max(0, Number(saved.bestScore) || fallback.bestScore),
      careerViews: Math.max(0, Number(saved.careerViews) || 0),
      careerLikes: Math.max(0, Number(saved.careerLikes) || 0),
      milestones: Array.isArray(saved.milestones)
        ? saved.milestones.filter((id: unknown): id is string => typeof id === "string")
        : [],
      outfit: OUTFITS.some((outfit) => outfit.id === saved.outfit)
        ? (saved.outfit as OutfitId)
        : fallback.outfit,
      creatorName:
        typeof saved.creatorName === "string" && saved.creatorName.trim()
          ? saved.creatorName.trim().slice(0, 18)
          : fallback.creatorName,
      posts: Array.isArray(saved.posts)
        ? saved.posts
            .filter((post: unknown): post is SavedPost => {
              if (!post || typeof post !== "object") return false;
              const item = post as Partial<SavedPost>;
              return (
                typeof item.id === "string" &&
                OUTFITS.some((outfit) => outfit.id === item.outfit) &&
                Number.isFinite(item.views) &&
                Number.isFinite(item.likes) &&
                Number.isFinite(item.score)
              );
            })
            .slice(0, 12)
        : [],
    };
  } catch {
    return fallback;
  }
}

function saveProfile(
  level: number,
  stars: number,
  fans: number,
  bestScore: number,
  careerViews: number,
  careerLikes: number,
  milestones: string[],
  outfit: OutfitId,
  creatorName: string,
  posts: SavedPost[],
) {
  window.localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify({
      level,
      stars,
      fans,
      bestScore,
      careerViews,
      careerLikes,
      milestones,
      outfit,
      creatorName,
      posts,
    }),
  );
  window.localStorage.setItem("starspark-best", String(bestScore));
}

export default function StarSparkGame() {
  const [appScreen, setAppScreen] = useState<AppScreen>("splash");
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
  const [backgroundTrack, setBackgroundTrack] = useState(0);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [popularity, setPopularity] = useState(55);
  const [moderatedCount, setModeratedCount] = useState(0);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitId>("star");
  const [careerViews, setCareerViews] = useState(0);
  const [careerLikes, setCareerLikes] = useState(0);
  const [unlockedMilestones, setUnlockedMilestones] = useState<string[]>([]);
  const [profileReady, setProfileReady] = useState(false);
  const [creatorName, setCreatorName] = useState("Zoe");
  const [draftCreatorName, setDraftCreatorName] = useState("Zoe");
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [questProgress, setQuestProgress] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [runReward, setRunReward] = useState<RunReward | null>(null);
  const lastActionRef = useRef(0);
  const beatAtRef = useRef(0);
  const checkpointRef = useRef(0);
  const reactionIdRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const usedMovesRef = useRef(new Set<MoveId>());
  const commentIdRef = useRef(0);
  const commentTurnRef = useRef(0);

  const currentLevel = LEVELS[playerLevel - 1] ?? LEVELS[0];
  const levelProgress = Math.min(100, Math.round((metrics.score / currentLevel.target) * 100));
  const beatMs = Math.max(535, 690 - (playerLevel - 1) * 17);
  const trendingMove = MOVES[Math.floor((currentLevel.roundSeconds - timeLeft) / 7) % MOVES.length].id;
  const comboGoalMet = bestCombo >= currentLevel.comboTarget;
  const mixGoalMet = questProgress >= currentLevel.moveTarget;
  const badCommentCount = liveComments.filter((comment) => comment.tone === "negative").length;
  const nextMilestone = MILESTONES.find(
    (milestone) => !unlockedMilestones.includes(milestone.id),
  );
  const creatorHandle = `@${creatorName.toLowerCase().replace(/[^a-z0-9]+/g, "") || "zoe"}spark`;
  const creatorRank =
    fans >= 10_000 ? "Creator Icon" : fans >= 1_000 ? "Rising Star" : fans >= 100 ? "New Favourite" : "Fresh Creator";
  const currentTrack = BACKGROUND_TRACKS[backgroundTrack];

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

  useEffect(() => {
    const music = new Audio();
    music.preload = "auto";
    music.volume = 0.28;
    const playNextTrack = () => {
      setBackgroundTrack((current) => (current + 1) % BACKGROUND_TRACKS.length);
    };
    music.addEventListener("ended", playNextTrack);
    musicRef.current = music;
    return () => {
      music.pause();
      music.removeEventListener("ended", playNextTrack);
      musicRef.current = null;
    };
  }, []);

  useEffect(() => {
    const music = musicRef.current;
    if (!music || typeof window === "undefined") return;
    const shouldPlay = appScreen === "live" && status === "playing" && soundOn;
    if (!shouldPlay) {
      music.pause();
      return;
    }
    const trackUrl = new URL(currentTrack.src, window.location.href).href;
    if (music.src !== trackUrl) {
      music.src = currentTrack.src;
      music.load();
    }
    void music.play().catch(() => {
      // Mobile browsers may wait for the next player tap before allowing audio.
    });
  }, [appScreen, currentTrack.src, soundOn, status]);

  const startGame = useCallback(() => {
    const music = musicRef.current;
    if (music && soundOn && typeof window !== "undefined") {
      const trackUrl = new URL(currentTrack.src, window.location.href).href;
      if (music.src !== trackUrl) {
        music.src = currentTrack.src;
        music.load();
      }
      void music.play().catch(() => {
        // The next live-screen interaction will retry playback if required.
      });
    }
    setAppScreen("live");
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
    setPopularity(55);
    setModeratedCount(0);
    setLiveComments([
      {
        id: commentIdRef.current++,
        name: "MiaStar",
        message: "Ready for the show! ✨",
        tone: "positive",
      },
      {
        id: commentIdRef.current++,
        name: "SafetySpark",
        message: "Tap the shield to clear unkind comments.",
        tone: "positive",
      },
    ]);
    usedMovesRef.current.clear();
    commentTurnRef.current = 0;
    checkpointRef.current = 0;
    beatAtRef.current = Date.now();
    lastActionRef.current = 0;
    playTone(true);
  }, [currentLevel, currentTrack.src, playTone, soundOn]);

  const finishCustomization = useCallback(() => {
    const safeName = draftCreatorName.trim().slice(0, 18) || "Zoe";
    setCreatorName(safeName);
    setDraftCreatorName(safeName);
    setStatus("ready");
    setAppScreen("profile");
  }, [draftCreatorName]);

  const openCustomization = useCallback(() => {
    setDraftCreatorName(creatorName);
    setAppScreen("customize");
  }, [creatorName]);

  const viewProfile = useCallback(() => {
    setStatus("ready");
    setRunReward(null);
    setAppScreen("profile");
  }, []);

  const performMove = useCallback(
    (moveId: MoveId) => {
      if (status !== "playing") return;
      const now = Date.now();
      if (now - lastActionRef.current < 180) return;
      lastActionRef.current = now;
      if (soundOn && musicRef.current?.paused) {
        void musicRef.current.play().catch(() => {});
      }

      const distanceFromBeat = Math.abs(now - beatAtRef.current);
      const perfect = distanceFromBeat < 155;
      const switched = lastMove !== moveId;
      const nextCombo = switched ? Math.min(combo + 1, 20) : Math.max(1, combo - 1);
      const isTrending = moveId === trendingMove;
      const isFunny = moveId === "silly" || moveId === "robot";
      const multiplier = Math.max(1, nextCombo);
      const scoreGain =
        34 * multiplier +
        (perfect ? 90 : 0) +
        (isTrending ? 125 : 0) +
        (isFunny ? 75 : 0);
      const discoveryRate =
        careerViews < 10 ? 0.45 : careerViews < 100 ? 0.8 : careerViews < 1_000 ? 1.15 : 1.5;
      const funnyBoost = isFunny ? 2.75 : 1;
      const popularityFactor = 0.55 + popularity / 100;
      const viewGain = Math.max(
        1,
        Math.round((scoreGain / 105) * discoveryRate * funnyBoost * popularityFactor),
      );
      const likeGain = Math.max(
        isFunny || perfect ? 1 : 0,
        Math.round(viewGain * (0.2 + popularity / 250)),
      );
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
        likes: current.likes + likeGain,
        views: current.views + viewGain,
        comments: current.comments + (perfect || isTrending ? 3 : 1),
        gifts: current.gifts + giftGain,
      }));
      setCareerViews((current) => current + viewGain);
      setCareerLikes((current) => current + likeGain);
      setPopularity((current) =>
        Math.min(100, current + (isFunny ? 3 : perfect || isTrending ? 2 : switched ? 1 : 0)),
      );

      const commentTurn = ++commentTurnRef.current;
      if (commentTurn % 2 === 0) {
        const isNegative =
          commentTurn % 6 === 0 || (playerLevel >= 3 && commentTurn % 5 === 0);
        const pool = isNegative ? NEGATIVE_COMMENTS : POSITIVE_COMMENTS;
        const [name, message] = pool[commentTurn % pool.length];
        const newComment: LiveComment = {
          id: commentIdRef.current++,
          name,
          message,
          tone: isNegative ? "negative" : "positive",
        };
        setLiveComments((current) => [...current.slice(-3), newComment]);
      }

      usedMovesRef.current.add(moveId);
      setQuestProgress(usedMovesRef.current.size);
      setFeedback(
        hitCheckpoint && nextCheckpoint < 3
          ? `CHECKPOINT ${nextCheckpoint}/3 · GIFT!`
          : hitCheckpoint
            ? "TARGET REACHED! ★"
            : isFunny
              ? `SILLY BOOST +${viewGain} VIEWS`
            : isTrending
          ? `TREND BOOST +${scoreGain}`
          : perfect
            ? `PERFECT! +${scoreGain}`
            : switched
              ? `NICE MIX! +${scoreGain}`
              : `Fresh move needed! +${scoreGain}`,
      );
      burstReactions(perfect || isTrending || isFunny ? 4 : 2);
      playTone(perfect || isTrending || isFunny);
    },
    [
      burstReactions,
      careerViews,
      combo,
      currentLevel.target,
      lastMove,
      metrics.score,
      playTone,
      playerLevel,
      popularity,
      soundOn,
      status,
      trendingMove,
    ],
  );

  const removeComment = useCallback(
    (commentId: number) => {
      if (status !== "playing") return;
      const comment = liveComments.find((item) => item.id === commentId);
      if (!comment || comment.tone !== "negative") return;
      setLiveComments((current) => current.filter((item) => item.id !== commentId));
      setModeratedCount((current) => current + 1);
      setPopularity((current) => Math.min(100, current + 8));
      setMetrics((current) => ({
        ...current,
        score: current.score + 125,
        likes: current.likes + 2,
        views: current.views + 5,
      }));
      setCareerLikes((current) => current + 2);
      setCareerViews((current) => current + 5);
      setFeedback("KINDNESS BONUS +125");
      burstReactions(5);
      playTone(true);
    },
    [burstReactions, liveComments, playTone, status],
  );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const profile = loadProfile();
      setPlayerLevel(profile.level);
      setStars(profile.stars);
      setFans(profile.fans);
      setBestScore(profile.bestScore);
      setCareerViews(profile.careerViews);
      setCareerLikes(profile.careerLikes);
      setUnlockedMilestones(profile.milestones);
      setSelectedOutfit(profile.outfit);
      setCreatorName(profile.creatorName);
      setDraftCreatorName(profile.creatorName);
      setSavedPosts(profile.posts);
      setTimeLeft(LEVELS[profile.level - 1].roundSeconds);
      setProfileReady(true);
    }, 0);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (!profileReady || appScreen !== "splash") return;
    const splashTimer = window.setTimeout(() => {
      setAppScreen("customize");
    }, 1400);
    return () => window.clearTimeout(splashTimer);
  }, [appScreen, profileReady]);

  useEffect(() => {
    if (!profileReady) return;
    saveProfile(
      playerLevel,
      stars,
      fans,
      bestScore,
      careerViews,
      careerLikes,
      unlockedMilestones,
      selectedOutfit,
      creatorName,
      savedPosts,
    );
  }, [
    bestScore,
    careerLikes,
    careerViews,
    fans,
    playerLevel,
    profileReady,
    creatorName,
    savedPosts,
    selectedOutfit,
    stars,
    unlockedMilestones,
  ]);

  useEffect(() => {
    if (!profileReady) return;
    const newlyReached = MILESTONES.filter((milestone) => {
      const total = milestone.metric === "views" ? careerViews : careerLikes;
      return total >= milestone.value && !unlockedMilestones.includes(milestone.id);
    });
    if (newlyReached.length === 0) return;
    const milestoneTimer = window.setTimeout(() => {
      const rewardStars = newlyReached.reduce((total, milestone) => total + milestone.stars, 0);
      setUnlockedMilestones((current) => [
        ...current,
        ...newlyReached.map((milestone) => milestone.id),
      ]);
      setStars((current) => current + rewardStars);
      const latest = newlyReached[newlyReached.length - 1];
      setFeedback(
        `${compact(latest.value)} ${latest.metric.toUpperCase()}! +${rewardStars} ★`,
      );
      burstReactions(8);
    }, 0);
    return () => window.clearTimeout(milestoneTimer);
  }, [
    burstReactions,
    careerLikes,
    careerViews,
    profileReady,
    unlockedMilestones,
  ]);

  useEffect(() => {
    if (status !== "playing" || badCommentCount === 0) return;
    const penaltyTimer = window.setInterval(() => {
      const viewerLoss = badCommentCount * Math.max(1, Math.ceil(playerLevel / 2));
      setPopularity((current) => Math.max(0, current - badCommentCount * 4));
      setMetrics((current) => ({
        ...current,
        likes: Math.max(0, current.likes - badCommentCount),
        views: Math.max(0, current.views - viewerLoss),
      }));
      setFeedback(`BAD VIBES · ${viewerLoss} VIEWER${viewerLoss === 1 ? "" : "S"} LEFT`);
    }, 2500);
    return () => window.clearInterval(penaltyTimer);
  }, [badCommentCount, playerLevel, status]);

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
      const moderationBonus = moderatedCount * 5;
      const earnedStars =
        (cleared ? currentLevel.rewardStars * rating : 0) + moderationBonus;
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
        moderationBonus,
      });
      if (metrics.score > bestScore) {
        setNewBest(true);
      }
      setBestScore(nextBest);
      setStars(nextStars);
      setFans(nextFans);
      setPlayerLevel(nextLevel);
      setSavedPosts((current) => [
        {
          id: `${Date.now()}-${currentLevel.level}`,
          outfit: selectedOutfit,
          views: metrics.views,
          likes: metrics.likes,
          score: metrics.score,
          level: currentLevel.level,
          title: currentLevel.title,
          cleared,
          createdAt: Date.now(),
        },
        ...current,
      ].slice(0, 12));
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
    metrics.likes,
    metrics.views,
    mixGoalMet,
    moderatedCount,
    playerLevel,
    selectedOutfit,
    stars,
    status,
    timeLeft,
  ]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (appScreen !== "live") return;
      if (event.key === " " && (status === "playing" || status === "paused")) {
        event.preventDefault();
        setStatus((current) => (current === "playing" ? "paused" : "playing"));
        return;
      }
      const move = MOVES.find((item) => item.key === event.key);
      if (move) performMove(move.id);
      if (event.key === "Enter" && status === "ready") {
        startGame();
      }
      if (event.key === "Enter" && status === "finished") {
        viewProfile();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appScreen, performMove, startGame, status, viewProfile]);

  if (appScreen === "splash") {
    return (
      <main className="journey-shell splash-screen" aria-label="StarSpark Live loading">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="splash-content">
          <div className="splash-logo">★</div>
          <p>SPARK · MOVE · SHINE</p>
          <h1>StarSpark <span>Live</span></h1>
          <div className="splash-loader"><i /></div>
          <small>A kid-safe creator adventure</small>
        </div>
      </main>
    );
  }

  if (appScreen === "customize") {
    return (
      <main className="journey-shell customization-screen">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <header className="journey-topbar">
          <div className="journey-brand"><span>★</span><strong>StarSpark <i>Live</i></strong></div>
          <div className="setup-step">CREATE YOUR STAR</div>
        </header>
        <section className="customization-layout">
          <div className="customization-preview">
            <div className="preview-spark preview-spark-one">✦</div>
            <div className="preview-spark preview-spark-two">♡</div>
            <div className="custom-character">
              <ZoeCharacter outfit={selectedOutfit} />
            </div>
            <div className="custom-shadow" />
            <div className="look-badge">
              <span>{OUTFITS.find((outfit) => outfit.id === selectedOutfit)?.icon}</span>
              <div>
                <small>LIVE LOOK</small>
                <strong>{OUTFITS.find((outfit) => outfit.id === selectedOutfit)?.name}</strong>
              </div>
            </div>
          </div>
          <div className="customization-panel">
            <p className="eyebrow">WELCOME, CREATOR</p>
            <h1>Make your star</h1>
            <p>Choose a creator name and the outfit you want to wear when you go live.</p>
            <label className="creator-name-field">
              <span>Creator name</span>
              <input
                value={draftCreatorName}
                onChange={(event) => setDraftCreatorName(event.target.value.slice(0, 18))}
                placeholder="Zoe"
                autoComplete="off"
              />
              <small>{draftCreatorName.length}/18</small>
            </label>
            <div className="custom-outfits">
              <div className="custom-section-title">
                <strong>Choose an outfit</strong>
                <small>More looks unlock as you grow</small>
              </div>
              <div className="custom-outfit-grid">
                {OUTFITS.map((outfit) => {
                  const unlocked =
                    !outfit.milestone || unlockedMilestones.includes(outfit.milestone);
                  return (
                    <button
                      type="button"
                      key={outfit.id}
                      className={selectedOutfit === outfit.id ? "selected" : ""}
                      disabled={!unlocked}
                      onClick={() => setSelectedOutfit(outfit.id)}
                    >
                      <i style={{ background: `linear-gradient(145deg, ${outfit.colors[0]}, ${outfit.colors[1]})` }}>
                        {unlocked ? outfit.icon : "🔒"}
                      </i>
                      <span>{outfit.name}</span>
                      <small>{unlocked ? (selectedOutfit === outfit.id ? "Wearing" : "Unlocked") : "Milestone reward"}</small>
                    </button>
                  );
                })}
              </div>
            </div>
            <button type="button" className="primary-button custom-continue" onClick={finishCustomization}>
              View my profile <span>↗</span>
            </button>
            <small className="local-note">Your creator profile is saved only on this device.</small>
          </div>
        </section>
      </main>
    );
  }

  if (appScreen === "profile") {
    return (
      <main className="journey-shell creator-profile-screen">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <header className="journey-topbar profile-appbar">
          <div className="journey-brand"><span>★</span><strong>StarSpark <i>Live</i></strong></div>
          <div className="profile-wallet">
            <span>★ {compact(stars)}</span>
            <button type="button" onClick={openCustomization}>Edit look</button>
          </div>
        </header>
        <section className="creator-profile">
          <div className="profile-identity">
            <div className="profile-portrait">
              <ZoeCharacter outfit={selectedOutfit} />
            </div>
            <div className="profile-name">
              <p>{creatorRank}</p>
              <h1>{creatorName}</h1>
              <span>{creatorHandle}</span>
            </div>
            <button type="button" className="edit-profile-button" onClick={openCustomization}>
              Customise
            </button>
          </div>
          <div className="profile-stats" aria-label="Creator profile totals">
            <div><strong>{compact(fans)}</strong><span>Fans</span></div>
            <div><strong>{compact(careerLikes)}</strong><span>Likes</span></div>
            <div><strong>{compact(careerViews)}</strong><span>Views</span></div>
            <div><strong>{savedPosts.length}</strong><span>Posts</span></div>
          </div>
          <div className="profile-actions">
            <button type="button" className="go-live-button" onClick={startGame}>
              <span>●</span>
              Go live now
            </button>
            <div className="next-show-card">
              <span>UP NEXT</span>
              <strong>Level {currentLevel.level} · {currentLevel.title}</strong>
              <small>{compact(currentLevel.target)} point target · Up to {compact(currentLevel.rewardFans * 3)} new fans</small>
            </div>
          </div>
          <div className="feed-heading">
            <div><span>▦</span><strong>My posts</strong></div>
            <small>Performance snapshots saved after every live</small>
          </div>
          {savedPosts.length > 0 ? (
            <div className="profile-feed">
              {savedPosts.map((post) => (
                <article className="feed-post" key={post.id}>
                  <div className="feed-post-room">
                    <span className="post-live">LIVE</span>
                    <div className="post-character"><ZoeCharacter outfit={post.outfit} /></div>
                    <div className="post-score">{compact(post.score)}</div>
                    <div className="post-gradient" />
                  </div>
                  <div className="post-meta">
                    <p>{post.cleared ? `${post.title} complete! ✨` : `${post.title} practice run`}</p>
                    <div>
                      <span>♥ {compact(post.likes)}</span>
                      <span>◉ {compact(post.views)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-feed">
              <span>▦</span>
              <h2>Your stage is ready</h2>
              <p>Finish your first live and its performance snapshot will appear here.</p>
              <button type="button" onClick={startGame}>Create first post</button>
            </div>
          )}
        </section>
        <nav className="profile-bottom-nav" aria-label="Creator navigation">
          <button type="button" className="active"><span>♙</span>Profile</button>
          <button type="button" className="nav-live" onClick={startGame}><span>●</span>Go Live</button>
          <button type="button" onClick={openCustomization}><span>✦</span>Outfits</button>
        </nav>
      </main>
    );
  }

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
          <div className="avatar-chip" aria-hidden="true">{creatorName.slice(0, 1).toUpperCase()}</div>
          <div className="level-copy">
            <strong>{creatorName}</strong>
            <span>Level {currentLevel.level} · {currentLevel.title}</span>
          </div>
          <div className="level-meter" aria-label={`${levelProgress}% of the current target`}>
            <i style={{ width: `${levelProgress}%` }} />
          </div>
        </div>

        <div className="wallet">
          <span><b>★</b> {compact(stars)}</span>
          <span className="fan-wallet">♥ {compact(fans)}</span>
          <span className="music-wallet">♫ {currentTrack.title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSoundOn((current) => !current)}
            aria-label={soundOn ? "Mute music and sound" : "Turn music and sound on"}
            title={soundOn ? `Now playing: ${currentTrack.title}` : "Music is muted"}
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
              <div><span>●</span><strong>{compact(metrics.comments)}</strong><small>Comments</small></div>
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
              <div className="popularity-row">
                <span>POPULARITY</span>
                <b>{popularity}%</b>
                <div><i style={{ width: `${popularity}%` }} /></div>
              </div>
            </div>

            <div className={`beat-orb ${beat ? "beat-now" : ""}`} aria-hidden="true">
              <span>BEAT</span>
            </div>

            <div className="avatar-zone">
              <div key={animationKey} className={`performer move-${activeMove ?? "idle"}`} aria-label="Zoe performing">
                <ZoeCharacter outfit={selectedOutfit} />
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

            <div className="chat-stack" aria-label="Kid-safe comment moderation">
              <div className="chat-monitor-label">
                <span>🛡</span> MODERATE · +125 SCORE
              </div>
              {liveComments.map((comment) => (
                <div className={`chat-bubble ${comment.tone}`} key={comment.id}>
                  <span>{comment.name.slice(0, 1)}</span>
                  <p><b>{comment.name}</b>{comment.message}</p>
                  {comment.tone === "negative" && status === "playing" && (
                    <button
                      type="button"
                      onClick={() => removeComment(comment.id)}
                      aria-label={`Remove unkind comment from ${comment.name}`}
                      title="Remove unkind comment"
                    >
                      🛡
                    </button>
                  )}
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
                <div className="outfit-picker">
                  <div>
                    <strong>Pick Zoe&apos;s live outfit</strong>
                    <small>Milestones unlock new looks</small>
                  </div>
                  <div className="outfit-list">
                    {OUTFITS.map((outfit) => {
                      const unlocked =
                        !outfit.milestone || unlockedMilestones.includes(outfit.milestone);
                      return (
                        <button
                          type="button"
                          key={outfit.id}
                          className={selectedOutfit === outfit.id ? "selected" : ""}
                          disabled={!unlocked}
                          onClick={() => setSelectedOutfit(outfit.id)}
                          aria-label={`${outfit.name}${unlocked ? "" : ", locked"}`}
                        >
                          <i
                            style={{
                              background: `linear-gradient(145deg, ${outfit.colors[0]}, ${outfit.colors[1]})`,
                            }}
                          >
                            {unlocked ? outfit.icon : "🔒"}
                          </i>
                          <span>{outfit.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="reward-preview">
                  <span>★ {compact(currentLevel.rewardStars)}–{compact(currentLevel.rewardStars * 3)}</span>
                  <span>♥ {compact(currentLevel.rewardFans)}–{compact(currentLevel.rewardFans * 3)}</span>
                  <span>{currentLevel.roundSeconds}s show</span>
                </div>
                {nextMilestone && (
                  <div className="next-milestone">
                    NEXT: {compact(nextMilestone.value)} {nextMilestone.metric.toUpperCase()} · {nextMilestone.reward}
                  </div>
                )}
                <button type="button" className="primary-button" onClick={startGame}>
                  Start show <span>↗</span>
                </button>
                <small>Press Enter to start · 1–7 to move</small>
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
            <p className="eyebrow">CREATOR MILESTONES</p>
            <h2>Grow from zero</h2>
            <div className="milestone-list">
              {MILESTONES.map((milestone) => {
                const complete = unlockedMilestones.includes(milestone.id);
                return (
                  <div className={complete ? "complete" : ""} key={milestone.id}>
                    <span>{complete ? "✓" : milestone.metric === "views" ? "◉" : "♥"}</span>
                    <p>
                      <b>{compact(milestone.value)} {milestone.metric}</b>
                      <small>{milestone.reward} · +{milestone.stars} ★</small>
                    </p>
                  </div>
                );
              })}
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
              <p>All comments are fictional and kid-safe. No camera, microphone, real chat, ads, or account needed.</p>
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
              <div><span>🛡</span><small>Moderated</small><strong>{moderatedCount}</strong></div>
            </div>
            {runReward.stars > 0 && (
              <div className="reward-payout">
                <span><b>+{compact(runReward.stars)}</b> stars</span>
                <span><b>+{compact(runReward.fans)}</b> fans</span>
                {runReward.moderationBonus > 0 && (
                  <span><b>+{runReward.moderationBonus}</b> kindness bonus</span>
                )}
              </div>
            )}
            <div className="result-actions">
              <button type="button" className="primary-button" onClick={viewProfile}>
                View my profile <span>↗</span>
              </button>
              <button type="button" className="secondary-result-button" onClick={startGame}>
                Go live again
              </button>
            </div>
            <small>Your new performance post is saved to your profile.</small>
          </div>
        </div>
      )}
    </main>
  );
}
