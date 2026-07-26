"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ZoeCharacter, {
  type HairStyleId,
  type MakeupId,
  type OutfitId,
} from "./ZoeCharacter";

type GameStatus = "ready" | "playing" | "paused" | "finished";
type AppScreen = "splash" | "customize" | "profile" | "live";
type MoveId = "dance" | "pose" | "spin" | "wave" | "trend" | "silly" | "robot";
type GameMode = "solo" | "battle";

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
  mode: GameMode;
  rating: number;
  stars: number;
  fans: number;
  level: number;
  title: string;
  target: number;
  moderationBonus: number;
  rivalName?: string;
  playerBattleScore?: number;
  rivalBattleScore?: number;
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
  hairStyle: HairStyleId;
  makeup: MakeupId;
  views: number;
  likes: number;
  score: number;
  level: number;
  title: string;
  cleared: boolean;
  mode: GameMode;
  rivalName?: string;
  createdAt: number;
};

type WardrobeTab = "outfits" | "hair" | "makeup";
type WardrobeItem<T extends string> = {
  id: T;
  name: string;
  icon: string;
  colors: [string, string];
  viewBoost: number;
  likeBoost: number;
  milestone?: string;
  tag?: string;
};

type BattleRival = {
  id: string;
  name: string;
  handle: string;
  title: string;
  icon: string;
  outfit: OutfitId;
  hairStyle: HairStyleId;
  makeup: MakeupId;
  skill: number;
  rewardBonus: number;
  catchphrases: readonly string[];
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

const OUTFITS: Array<WardrobeItem<OutfitId>> = [
  { id: "star", name: "Star Pop", icon: "⭐", colors: ["#f8f1ff", "#ad38b5"], viewBoost: 0, likeBoost: 0, tag: "Street" },
  { id: "bubble", name: "Bubble Beat", icon: "🫧", colors: ["#ffb6e4", "#27cbd5"], viewBoost: 3, likeBoost: 2, tag: "Street" },
  { id: "rainbow-dress", name: "Rainbow Twirl", icon: "🌈", colors: ["#ff9fda", "#63e8df"], viewBoost: 5, likeBoost: 9, milestone: "views-10", tag: "Dress" },
  { id: "sunset", name: "Sunset Jam", icon: "🌅", colors: ["#ffd86a", "#ed477e"], viewBoost: 6, likeBoost: 5, milestone: "views-100", tag: "Street" },
  { id: "neon", name: "Neon Night", icon: "⚡", colors: ["#67ffe5", "#5847dc"], viewBoost: 8, likeBoost: 7, milestone: "likes-100", tag: "Street" },
  { id: "moon-dress", name: "Moonlight Wish", icon: "🌙", colors: ["#bcecff", "#6552d6"], viewBoost: 10, likeBoost: 6, milestone: "likes-100", tag: "Dress" },
  { id: "galaxy", name: "Galaxy Glow", icon: "🌌", colors: ["#e247c7", "#221b5f"], viewBoost: 12, likeBoost: 10, milestone: "views-1000", tag: "Street" },
  { id: "royal-dress", name: "Royal Spark", icon: "👑", colors: ["#ffe771", "#9c3ca8"], viewBoost: 15, likeBoost: 15, milestone: "likes-1000", tag: "Dress" },
];

const HAIR_STYLES: Array<WardrobeItem<HairStyleId>> = [
  { id: "space-buns", name: "Space Buns", icon: "🎀", colors: ["#8a3e1b", "#2c0d09"], viewBoost: 0, likeBoost: 0 },
  { id: "ponytail", name: "Pop Pony", icon: "✨", colors: ["#9b4b21", "#32100c"], viewBoost: 2, likeBoost: 2 },
  { id: "braids", name: "Beat Braids", icon: "💖", colors: ["#7e361c", "#25100b"], viewBoost: 4, likeBoost: 3, milestone: "views-10" },
  { id: "curls", name: "Cloud Curls", icon: "☁️", colors: ["#a65329", "#3a130c"], viewBoost: 3, likeBoost: 5, milestone: "likes-10" },
  { id: "bob", name: "Creator Bob", icon: "✂️", colors: ["#6f2c18", "#240b08"], viewBoost: 6, likeBoost: 4, milestone: "views-100" },
  { id: "crown-braid", name: "Crown Braid", icon: "👑", colors: ["#9a4a22", "#32100b"], viewBoost: 10, likeBoost: 10, milestone: "likes-1000" },
];

const MAKEUP_LOOKS: Array<WardrobeItem<MakeupId>> = [
  { id: "natural", name: "Fresh Face", icon: "😊", colors: ["#ffd7b4", "#e99a76"], viewBoost: 0, likeBoost: 0 },
  { id: "blush-pop", name: "Blush Pop", icon: "🌸", colors: ["#ffb3c6", "#ee668b"], viewBoost: 1, likeBoost: 3 },
  { id: "sparkle", name: "Star Sparkle", icon: "✨", colors: ["#fff16d", "#ff6dc4"], viewBoost: 3, likeBoost: 5, milestone: "likes-10" },
  { id: "neon", name: "Neon Liner", icon: "⚡", colors: ["#54f4eb", "#ff5fc0"], viewBoost: 6, likeBoost: 7, milestone: "likes-100" },
  { id: "galaxy", name: "Galaxy Glow", icon: "🌌", colors: ["#a56eff", "#56e9ef"], viewBoost: 8, likeBoost: 9, milestone: "views-1000" },
];

const BATTLE_RIVALS: BattleRival[] = [
  {
    id: "sunny-sam",
    name: "Sunny Sam",
    handle: "@sunnyspark",
    title: "Happy Dance Rookie",
    icon: "🌞",
    outfit: "sunset",
    hairStyle: "ponytail",
    makeup: "blush-pop",
    skill: 0.78,
    rewardBonus: 40,
    catchphrases: ["Sunshine combo!", "Let’s make this silly!", "Great move, Zoe!"],
  },
  {
    id: "remy-robot",
    name: "Remy Robot",
    handle: "@remybeep",
    title: "Beat Bot Challenger",
    icon: "🤖",
    outfit: "neon",
    hairStyle: "bob",
    makeup: "neon",
    skill: 0.93,
    rewardBonus: 65,
    catchphrases: ["Beep boop—bonus!", "Robot rhythm activated!", "Your combo is strong!"],
  },
  {
    id: "luna-loops",
    name: "Luna Loops",
    handle: "@lunaloops",
    title: "Galaxy Dance Pro",
    icon: "🌙",
    outfit: "moon-dress",
    hairStyle: "curls",
    makeup: "galaxy",
    skill: 1.08,
    rewardBonus: 90,
    catchphrases: ["Moon move incoming!", "Sparkles to maximum!", "This battle is close!"],
  },
  {
    id: "kiki-crown",
    name: "Queen Kiki",
    handle: "@kikicrown",
    title: "Creator Battle Champion",
    icon: "👑",
    outfit: "royal-dress",
    hairStyle: "crown-braid",
    makeup: "sparkle",
    skill: 1.22,
    rewardBonus: 140,
    catchphrases: ["Royal combo!", "Bring your brightest move!", "You’re a true star!"],
  },
];

const MILESTONES: Milestone[] = [
  { id: "views-10", metric: "views", value: 10, stars: 25, reward: "Rainbow dress + Beat Braids" },
  { id: "likes-10", metric: "likes", value: 10, stars: 25, reward: "Cloud Curls + Star Sparkle" },
  { id: "views-100", metric: "views", value: 100, stars: 75, reward: "Sunset outfit + Creator Bob" },
  { id: "likes-100", metric: "likes", value: 100, stars: 75, reward: "Neon set + Moonlight dress" },
  { id: "views-1000", metric: "views", value: 1_000, stars: 200, reward: "Galaxy outfit + makeup" },
  { id: "likes-1000", metric: "likes", value: 1_000, stars: 250, reward: "Royal dress + Crown Braid" },
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
    hairStyle: "space-buns" as HairStyleId,
    makeup: "natural" as MakeupId,
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
      hairStyle: HAIR_STYLES.some((hair) => hair.id === saved.hairStyle)
        ? (saved.hairStyle as HairStyleId)
        : fallback.hairStyle,
      makeup: MAKEUP_LOOKS.some((makeup) => makeup.id === saved.makeup)
        ? (saved.makeup as MakeupId)
        : fallback.makeup,
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
            .map((post) => ({
              ...post,
              hairStyle: HAIR_STYLES.some((hair) => hair.id === post.hairStyle)
                ? post.hairStyle
                : ("space-buns" as HairStyleId),
              makeup: MAKEUP_LOOKS.some((look) => look.id === post.makeup)
                ? post.makeup
                : ("natural" as MakeupId),
              mode: post.mode === "battle" ? "battle" : ("solo" as GameMode),
              rivalName:
                typeof post.rivalName === "string" ? post.rivalName : undefined,
            }))
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
  hairStyle: HairStyleId,
  makeup: MakeupId,
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
      hairStyle,
      makeup,
      creatorName,
      posts,
    }),
  );
  window.localStorage.setItem("starspark-best", String(bestScore));
}

export default function StarSparkGame() {
  const [appScreen, setAppScreen] = useState<AppScreen>("splash");
  const [status, setStatus] = useState<GameStatus>("ready");
  const [gameMode, setGameMode] = useState<GameMode>("solo");
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
  const [selectedHairStyle, setSelectedHairStyle] = useState<HairStyleId>("space-buns");
  const [selectedMakeup, setSelectedMakeup] = useState<MakeupId>("natural");
  const [wardrobeTab, setWardrobeTab] = useState<WardrobeTab>("outfits");
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
  const [battlePlayerScore, setBattlePlayerScore] = useState(0);
  const [battleRivalScore, setBattleRivalScore] = useState(0);
  const [rivalMove, setRivalMove] = useState<MoveId>("dance");
  const [rivalAnimationKey, setRivalAnimationKey] = useState(0);
  const [battleNotice, setBattleNotice] = useState("Battle invitation accepted!");
  const lastActionRef = useRef(0);
  const beatAtRef = useRef(0);
  const checkpointRef = useRef(0);
  const reactionIdRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const usedMovesRef = useRef(new Set<MoveId>());
  const commentIdRef = useRef(0);
  const commentTurnRef = useRef(0);
  const rivalPulseRef = useRef(0);

  const currentLevel = LEVELS[playerLevel - 1] ?? LEVELS[0];
  const currentRival =
    BATTLE_RIVALS[
      Math.min(BATTLE_RIVALS.length - 1, Math.floor((playerLevel - 1) / 3))
    ];
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
  const battleTotal = Math.max(1, battlePlayerScore + battleRivalScore);
  const battlePlayerShare = Math.round((battlePlayerScore / battleTotal) * 100);
  const selectedOutfitItem = OUTFITS.find((item) => item.id === selectedOutfit) ?? OUTFITS[0];
  const selectedHairItem = HAIR_STYLES.find((item) => item.id === selectedHairStyle) ?? HAIR_STYLES[0];
  const selectedMakeupItem = MAKEUP_LOOKS.find((item) => item.id === selectedMakeup) ?? MAKEUP_LOOKS[0];
  const wardrobeViewBoost =
    selectedOutfitItem.viewBoost + selectedHairItem.viewBoost + selectedMakeupItem.viewBoost;
  const wardrobeLikeBoost =
    selectedOutfitItem.likeBoost + selectedHairItem.likeBoost + selectedMakeupItem.likeBoost;
  const wardrobeItemUnlocked = useCallback(
    (milestone?: string) => !milestone || unlockedMilestones.includes(milestone),
    [unlockedMilestones],
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

  const beginShow = useCallback((mode: GameMode) => {
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
    setGameMode(mode);
    setAppScreen("live");
    setStatus("playing");
    setTimeLeft(currentLevel.roundSeconds);
    setMetrics(EMPTY_METRICS);
    setCombo(0);
    setBestCombo(0);
    setPerfects(0);
    setLastMove(null);
    setActiveMove(null);
    setFeedback(
      mode === "battle"
        ? `BATTLE START · VS ${currentRival.name.toUpperCase()}`
        : `LOOK BOOST · +${wardrobeViewBoost}% VIEWS · +${wardrobeLikeBoost}% LIKES`,
    );
    setQuestProgress(0);
    setNewBest(false);
    setRunReward(null);
    setPopularity(Math.min(70, 55 + Math.floor((wardrobeViewBoost + wardrobeLikeBoost) / 8)));
    setModeratedCount(0);
    setBattlePlayerScore(0);
    setBattleRivalScore(0);
    setRivalMove("dance");
    setRivalAnimationKey((current) => current + 1);
    setBattleNotice(`${currentRival.name}: ${currentRival.catchphrases[0]}`);
    setLiveComments([
      {
        id: commentIdRef.current++,
        name: "MiaStar",
        message: mode === "battle" ? `Battle time! Go ${creatorName}! ⚔️` : "Ready for the show! ✨",
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
    rivalPulseRef.current = 0;
    playTone(true);
  }, [
    currentLevel,
    currentRival,
    currentTrack.src,
    creatorName,
    playTone,
    soundOn,
    wardrobeLikeBoost,
    wardrobeViewBoost,
  ]);

  const startGame = useCallback(() => beginShow("solo"), [beginShow]);
  const startBattle = useCallback(() => beginShow("battle"), [beginShow]);

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
      const baseViewGain = Math.max(
        1,
        Math.round((scoreGain / 105) * discoveryRate * funnyBoost * popularityFactor),
      );
      const viewGain = Math.max(
        1,
        Math.round(baseViewGain * (1 + wardrobeViewBoost / 100)),
      );
      const baseLikeGain = Math.max(
        isFunny || perfect ? 1 : 0,
        Math.round(viewGain * (0.2 + popularity / 250)),
      );
      const likeGain = Math.max(
        isFunny || perfect ? 1 : 0,
        Math.round(baseLikeGain * (1 + wardrobeLikeBoost / 100)),
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
      const battlePointGain = Math.max(
        1,
        Math.round(
          (scoreGain / 14 + likeGain * 2 + giftGain * 35) *
            (timeLeft <= 5 ? 1.5 : 1),
        ),
      );
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
      if (gameMode === "battle") {
        setBattlePlayerScore((current) => current + battlePointGain);
      }
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
      gameMode,
      lastMove,
      metrics.score,
      playTone,
      playerLevel,
      popularity,
      soundOn,
      status,
      timeLeft,
      trendingMove,
      wardrobeLikeBoost,
      wardrobeViewBoost,
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
      setSelectedHairStyle(profile.hairStyle);
      setSelectedMakeup(profile.makeup);
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
      selectedHairStyle,
      selectedMakeup,
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
    selectedHairStyle,
    selectedMakeup,
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
    if (status !== "playing" || gameMode !== "battle") return;
    const rivalTimer = window.setInterval(() => {
      const pulse = ++rivalPulseRef.current;
      const finalRush = timeLeft <= 5 ? 1.65 : 1;
      const rivalGain = Math.max(
        1,
        Math.round(
          (10 + playerLevel * 1.8 + Math.random() * 10) *
            currentRival.skill *
            finalRush,
        ),
      );
      const nextMove = MOVES[pulse % MOVES.length].id;
      setBattleRivalScore((current) => current + rivalGain);
      setRivalMove(nextMove);
      setRivalAnimationKey((current) => current + 1);

      if (pulse % 3 === 0) {
        const message =
          currentRival.catchphrases[
            Math.floor(pulse / 3) % currentRival.catchphrases.length
          ];
        setBattleNotice(`${currentRival.name}: ${message}`);
      }
      if (pulse % 5 === 0) {
        setLiveComments((current) => [
          ...current.slice(-3),
          {
            id: commentIdRef.current++,
            name: currentRival.name,
            message: currentRival.catchphrases[pulse % currentRival.catchphrases.length],
            tone: "positive",
          },
        ]);
      }
    }, 900);
    return () => window.clearInterval(rivalTimer);
  }, [currentRival, gameMode, playerLevel, status, timeLeft]);

  useEffect(() => {
    if (status !== "playing" || timeLeft > 0) return;
    const finishTimer = window.setTimeout(() => {
      const cleared =
        gameMode === "battle"
          ? battlePlayerScore >= battleRivalScore
          : metrics.score >= currentLevel.target;
      const rating = cleared
        ? 1 + Number(comboGoalMet) + Number(mixGoalMet)
        : 0;
      const moderationBonus = moderatedCount * 5;
      const battleBonus =
        gameMode === "battle" && cleared ? currentRival.rewardBonus : 0;
      const earnedStars =
        (cleared ? currentLevel.rewardStars * rating : 0) +
        moderationBonus +
        battleBonus;
      const earnedFans = cleared
        ? currentLevel.rewardFans * rating + battleBonus * 2
        : 0;
      const nextLevel = cleared
        ? Math.min(LEVELS.length, playerLevel + 1)
        : playerLevel;
      const nextStars = stars + earnedStars;
      const nextFans = fans + earnedFans;
      const nextBest = Math.max(bestScore, metrics.score);

      setStatus("finished");
      setFeedback(
        gameMode === "battle"
          ? cleared
            ? "Battle won!"
            : "Great battle—rematch ready!"
          : cleared
            ? "Level cleared!"
            : "So close—try the target again!",
      );
      setRunReward({
        cleared,
        mode: gameMode,
        rating,
        stars: earnedStars,
        fans: earnedFans,
        level: currentLevel.level,
        title: currentLevel.title,
        target: currentLevel.target,
        moderationBonus,
        rivalName: gameMode === "battle" ? currentRival.name : undefined,
        playerBattleScore: gameMode === "battle" ? battlePlayerScore : undefined,
        rivalBattleScore: gameMode === "battle" ? battleRivalScore : undefined,
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
          hairStyle: selectedHairStyle,
          makeup: selectedMakeup,
          views: metrics.views,
          likes: metrics.likes,
          score: metrics.score,
          level: currentLevel.level,
          title: currentLevel.title,
          cleared,
          mode: gameMode,
          rivalName: gameMode === "battle" ? currentRival.name : undefined,
          createdAt: Date.now(),
        },
        ...current,
      ].slice(0, 12));
      burstReactions(cleared ? 10 : 5);
    }, 0);
    return () => window.clearTimeout(finishTimer);
  }, [
    battlePlayerScore,
    battleRivalScore,
    bestScore,
    burstReactions,
    comboGoalMet,
    currentLevel,
    currentRival,
    fans,
    metrics.score,
    metrics.likes,
    metrics.views,
    mixGoalMet,
    moderatedCount,
    gameMode,
    playerLevel,
    selectedHairStyle,
    selectedMakeup,
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
              <ZoeCharacter
                outfit={selectedOutfit}
                hairStyle={selectedHairStyle}
                makeup={selectedMakeup}
              />
            </div>
            <div className="custom-shadow" />
            <div className="look-badge">
              <span>{selectedOutfitItem.icon}</span>
              <div>
                <small>STYLE POWER</small>
                <strong>+{wardrobeViewBoost}% views · +{wardrobeLikeBoost}% likes</strong>
              </div>
            </div>
          </div>
          <div className="customization-panel">
            <p className="eyebrow">WELCOME, CREATOR</p>
            <h1>Build your look</h1>
            <p>Mix outfits, hairstyles, and kid-friendly face sparkle. Stronger looks give your live a small discovery boost.</p>
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
            <div className="custom-outfits wardrobe-builder">
              <div className="custom-section-title">
                <strong>Full wardrobe</strong>
                <small>Milestones unlock more styles</small>
              </div>
              <div className="wardrobe-tabs" role="tablist" aria-label="Wardrobe categories">
                <button type="button" role="tab" aria-selected={wardrobeTab === "outfits"} className={wardrobeTab === "outfits" ? "selected" : ""} onClick={() => setWardrobeTab("outfits")}>👗 Outfits</button>
                <button type="button" role="tab" aria-selected={wardrobeTab === "hair"} className={wardrobeTab === "hair" ? "selected" : ""} onClick={() => setWardrobeTab("hair")}>🎀 Hair</button>
                <button type="button" role="tab" aria-selected={wardrobeTab === "makeup"} className={wardrobeTab === "makeup" ? "selected" : ""} onClick={() => setWardrobeTab("makeup")}>✨ Makeup</button>
              </div>
              <div className="custom-outfit-grid wardrobe-grid" role="tabpanel">
                {wardrobeTab === "outfits" && OUTFITS.map((item) => {
                  const unlocked = wardrobeItemUnlocked(item.milestone);
                  return (
                    <button type="button" key={item.id} className={selectedOutfit === item.id ? "selected" : ""} disabled={!unlocked} onClick={() => setSelectedOutfit(item.id)}>
                      <i style={{ background: `linear-gradient(145deg, ${item.colors[0]}, ${item.colors[1]})` }}>{unlocked ? item.icon : "🔒"}</i>
                      <span>{item.name}</span>
                      <small>{unlocked ? `+${item.viewBoost}% ◉ · +${item.likeBoost}% ♥` : "Milestone reward"}</small>
                      {item.tag && <em>{item.tag}</em>}
                    </button>
                  );
                })}
                {wardrobeTab === "hair" && HAIR_STYLES.map((item) => {
                  const unlocked = wardrobeItemUnlocked(item.milestone);
                  return (
                    <button type="button" key={item.id} className={selectedHairStyle === item.id ? "selected" : ""} disabled={!unlocked} onClick={() => setSelectedHairStyle(item.id)}>
                      <i style={{ background: `linear-gradient(145deg, ${item.colors[0]}, ${item.colors[1]})` }}>{unlocked ? item.icon : "🔒"}</i>
                      <span>{item.name}</span>
                      <small>{unlocked ? `+${item.viewBoost}% ◉ · +${item.likeBoost}% ♥` : "Milestone reward"}</small>
                    </button>
                  );
                })}
                {wardrobeTab === "makeup" && MAKEUP_LOOKS.map((item) => {
                  const unlocked = wardrobeItemUnlocked(item.milestone);
                  return (
                    <button type="button" key={item.id} className={selectedMakeup === item.id ? "selected" : ""} disabled={!unlocked} onClick={() => setSelectedMakeup(item.id)}>
                      <i style={{ background: `linear-gradient(145deg, ${item.colors[0]}, ${item.colors[1]})` }}>{unlocked ? item.icon : "🔒"}</i>
                      <span>{item.name}</span>
                      <small>{unlocked ? `+${item.viewBoost}% ◉ · +${item.likeBoost}% ♥` : "Milestone reward"}</small>
                    </button>
                  );
                })}
              </div>
              <div className="wardrobe-loadout">
                <span>{selectedOutfitItem.icon} {selectedOutfitItem.name}</span>
                <span>{selectedHairItem.icon} {selectedHairItem.name}</span>
                <span>{selectedMakeupItem.icon} {selectedMakeupItem.name}</span>
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
              <ZoeCharacter outfit={selectedOutfit} hairStyle={selectedHairStyle} makeup={selectedMakeup} />
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
            <button type="button" className="go-live-button battle-launch-button" onClick={startBattle}>
              <span>⚔</span>
              Battle {currentRival.name}
            </button>
            <div className="next-show-card">
              <span>UP NEXT · SOLO OR BATTLE</span>
              <strong>Level {currentLevel.level} · {currentLevel.title}</strong>
              <small>{compact(currentLevel.target)} point target · Up to {compact(currentLevel.rewardFans * 3)} new fans</small>
              <small className="next-rival">⚔ {currentRival.name} · +{currentRival.rewardBonus} ★ win bonus</small>
              <small className="profile-style-boost">✨ Look boost: +{wardrobeViewBoost}% views · +{wardrobeLikeBoost}% likes</small>
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
                    <span className={`post-live ${post.mode === "battle" ? "battle-post" : ""}`}>
                      {post.mode === "battle" ? "BATTLE" : "LIVE"}
                    </span>
                    <div className="post-character">
                      <ZoeCharacter outfit={post.outfit} hairStyle={post.hairStyle} makeup={post.makeup} />
                    </div>
                    <div className="post-score">{compact(post.score)}</div>
                    <div className="post-gradient" />
                  </div>
                  <div className="post-meta">
                    <p>
                      {post.mode === "battle"
                        ? `${post.cleared ? "Won" : "Battled"} vs ${post.rivalName ?? "a creator"} ${post.cleared ? "🏆" : "⚔️"}`
                        : post.cleared
                          ? `${post.title} complete! ✨`
                          : `${post.title} practice run`}
                    </p>
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
          <button type="button" onClick={openCustomization}><span>✦</span>Wardrobe</button>
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
          <div className={`stage-frame status-${status} ${gameMode === "battle" ? "battle-mode" : ""}`}>
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
                {status === "playing"
                  ? gameMode === "battle"
                    ? "BATTLE"
                    : "LIVE"
                  : status.toUpperCase()}
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

            {gameMode === "solo" ? (
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
              <div className="style-boost-row">
                ✨ LOOK +{wardrobeViewBoost}% ◉ · +{wardrobeLikeBoost}% ♥
              </div>
              </div>
            ) : (
              <div className={`battle-scoreboard ${timeLeft <= 5 ? "power-round" : ""}`} aria-label={`Battle score: ${creatorName} ${battlePlayerScore}, ${currentRival.name} ${battleRivalScore}`}>
                <div className="battle-creator-score player">
                  <span>{creatorName}</span>
                  <strong>{compact(battlePlayerScore)}</strong>
                </div>
                <div className="battle-vs">
                  <b>VS</b>
                  <small>{timeLeft <= 5 ? "POWER!" : "MATCH"}</small>
                </div>
                <div className="battle-creator-score rival">
                  <span>{currentRival.name}</span>
                  <strong>{compact(battleRivalScore)}</strong>
                </div>
                <div className="battle-balance">
                  <i style={{ width: `${battlePlayerShare}%` }} />
                  <em />
                </div>
              </div>
            )}

            <div className={`beat-orb ${beat ? "beat-now" : ""}`} aria-hidden="true">
              <span>BEAT</span>
            </div>

            <div className={`avatar-zone ${gameMode === "battle" ? "battle-player-zone" : ""}`}>
              <div className="performer-anchor">
                <div key={animationKey} className={`performer move-${activeMove ?? "idle"}`} aria-label="Zoe performing">
                  <ZoeCharacter outfit={selectedOutfit} hairStyle={selectedHairStyle} makeup={selectedMakeup} />
                </div>
              </div>
              <div className="stage-shadow" />
              {gameMode === "battle" && (
                <div className="battle-side-name player">
                  <b>{creatorName}</b>
                  <span>{creatorHandle}</span>
                </div>
              )}
            </div>

            {gameMode === "battle" && (
              <div className="battle-rival-zone">
                <div className="battle-rival-anchor">
                  <div key={rivalAnimationKey} className={`performer rival-performer move-${rivalMove}`} aria-label={`${currentRival.name} performing`}>
                    <ZoeCharacter outfit={currentRival.outfit} hairStyle={currentRival.hairStyle} makeup={currentRival.makeup} />
                  </div>
                </div>
                <div className="stage-shadow" />
                <div className="battle-rival-bubble">{battleNotice}</div>
                <div className="battle-side-name rival">
                  <b>{currentRival.icon} {currentRival.name}</b>
                  <span>{currentRival.handle}</span>
                </div>
              </div>
            )}

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
                <div className="outfit-picker live-look-picker">
                  <div>
                    <strong>Your live look</strong>
                    <small>+{wardrobeViewBoost}% views · +{wardrobeLikeBoost}% likes</small>
                  </div>
                  <div className="live-look-list">
                    <span>{selectedOutfitItem.icon}<b>{selectedOutfitItem.name}</b></span>
                    <span>{selectedHairItem.icon}<b>{selectedHairItem.name}</b></span>
                    <span>{selectedMakeupItem.icon}<b>{selectedMakeupItem.name}</b></span>
                  </div>
                  <button type="button" className="edit-live-look" onClick={openCustomization}>Edit wardrobe</button>
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
            <p>{gameMode === "battle" ? "Creator Battle" : `Level ${currentLevel.level}`}</p>
            <div>
              <small>{gameMode === "battle" ? "Match" : "Target"}</small>
              <strong>{gameMode === "battle" ? `${battlePlayerShare}%` : `${levelProgress}%`}</strong>
            </div>
            <div><small>Best combo</small><strong>×{bestCombo}</strong></div>
            <div><small>Perfect beats</small><strong>{perfects}</strong></div>
          </div>
        </div>

        <aside className="side-panel">
          <section className="mission-card">
            <div className="section-heading">
              <span>{gameMode === "battle" ? `Battle vs ${currentRival.name}` : `Level ${currentLevel.level} goals`}</span>
              <b>Up to {compact(currentLevel.rewardStars * 3)} ★</b>
            </div>
            <h2>{gameMode === "battle" ? currentRival.title : currentLevel.title}</h2>
            <div className="goal-list">
              <div className={(gameMode === "battle" ? battlePlayerScore >= battleRivalScore : metrics.score >= currentLevel.target) ? "complete" : ""}>
                <i>{(gameMode === "battle" ? battlePlayerScore >= battleRivalScore : metrics.score >= currentLevel.target) ? "✓" : "1"}</i>
                <span>
                  <b>{gameMode === "battle" ? "Beat the rival" : "Score target"}</b>
                  <small>
                    {gameMode === "battle"
                      ? `${compact(battlePlayerScore)} / ${compact(battleRivalScore)}`
                      : `${compact(metrics.score)} / ${compact(currentLevel.target)}`}
                  </small>
                </span>
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
              {runReward.mode === "battle"
                ? `CREATOR BATTLE · VS ${runReward.rivalName}`
                : `LEVEL ${runReward.level} · ${runReward.title}`}
            </p>
            <h2 id="result-title">
              {runReward.mode === "battle"
                ? runReward.cleared
                  ? "Battle won!"
                  : "Rival wins!"
                : runReward.cleared
                  ? "Level cleared!"
                  : "Almost there!"}
            </h2>
            <p>
              {runReward.mode === "battle"
                ? `${creatorName} scored ${compact(runReward.playerBattleScore ?? 0)} match points against ${runReward.rivalName}'s ${compact(runReward.rivalBattleScore ?? 0)}.`
                : runReward.cleared
                  ? `Target passed with a ×${bestCombo} combo and ${questProgress} different moves.`
                  : `${compact(runReward.target - metrics.score)} more points will unlock the next level.`}
            </p>
            <div className="result-stars" aria-label={`${runReward.rating} of 3 stars earned`}>
              {[1, 2, 3].map((star) => (
                <span key={star} className={runReward.rating >= star ? "earned" : ""}>★</span>
              ))}
            </div>
            <div className="result-score">
              {compact(runReward.mode === "battle" ? runReward.playerBattleScore ?? 0 : metrics.score)}
            </div>
            <div className="result-progress">
              <i
                style={{
                  width: `${runReward.mode === "battle"
                    ? Math.round(
                        ((runReward.playerBattleScore ?? 0) /
                          Math.max(
                            1,
                            (runReward.playerBattleScore ?? 0) +
                              (runReward.rivalBattleScore ?? 0),
                          )) *
                          100,
                      )
                    : Math.min(100, (metrics.score / runReward.target) * 100)}%`,
                }}
              />
            </div>
            <small className="result-target">
              {runReward.mode === "battle"
                ? `Rival ${compact(runReward.rivalBattleScore ?? 0)}`
                : `Target ${compact(runReward.target)}`}
            </small>
            <div className="result-grid">
              <div><span>♥</span><small>Likes</small><strong>{compact(metrics.likes)}</strong></div>
              <div><span>✦</span><small>Perfects</small><strong>{perfects}</strong></div>
              <div><span>🎁</span><small>Gifts</small><strong>{metrics.gifts}</strong></div>
              <div><span>🛡</span><small>Moderated</small><strong>{moderatedCount}</strong></div>
            </div>
            <div className="result-look-bonus">
              ✨ Wardrobe boost applied: +{wardrobeViewBoost}% views · +{wardrobeLikeBoost}% likes
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
              <button type="button" className="secondary-result-button" onClick={runReward.mode === "battle" ? startBattle : startGame}>
                {runReward.mode === "battle" ? "Battle again" : "Go live again"}
              </button>
            </div>
            <small>Your new {runReward.mode === "battle" ? "battle" : "performance"} post is saved to your profile.</small>
          </div>
        </div>
      )}
    </main>
  );
}
