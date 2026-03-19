"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { SparklesCore } from "@/components/ui/sparkles";
import { FlowerBurst, FloatingEmojis } from "@/components/ui/flower-burst";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LoveRevealCard } from "@/components/ui/love-reveal-card";
import { FireworksDisplay, GalaxyAnimation, HindiTextReveal } from "@/components/ui/fireworks-galaxy";
import { Vortex } from "@/components/ui/vortex";
import { HeroHighlight, Highlight, World } from "@/components/ui/hero-highlight";

// ─── Game Level Definitions (8 levels) ──────────────────────────────────────

const LEVELS = [
  {
    id: 0,
    name: "A Letter For You",
    emoji: "💌",
    bg: "from-rose-950 via-black to-pink-950",
    sparkleColor: "#ff6eb0",
    headline: "Hey Kashish 🌸",
    body: "I made you something. It took a while, a lot of love, and maybe a little courage too. It's just for you. Ready?",
    cta: "Open it 💖",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 1,
    name: "From My Heart",
    emoji: "🌹",
    bg: "from-red-950 via-black to-rose-950",
    sparkleColor: "#ff4466",
    headline: "I'm genuinely sorry.",
    body: "I know I haven't always been perfect. I've said things I shouldn't have, and not said things I should have. You deserved better from me in those moments. And I'm working on it every single day because YOU are worth it.",
    cta: "I hear you 🌹",
    secretMessage: "The fact that you're still here means everything to me. You have no idea. 🥺",
    cards: false,
    final: false,
  },
  {
    id: 2,
    name: "Why I Love You",
    emoji: "🌸",
    bg: "from-purple-950 via-black to-pink-950",
    sparkleColor: "#c084fc",
    headline: "Let me count the ways 💕",
    body: "Tap every card to unlock what I love about you 🌸",
    cta: "All unlocked! 💕",
    secretMessage: null as string | null,
    cards: true,
    final: false,
  },
  {
    id: 3,
    name: "Thank You",
    emoji: "✨",
    bg: "from-indigo-950 via-black to-purple-950",
    sparkleColor: "#a78bfa",
    headline: "Thank you for everything.",
    body: "For every late night call. For every time you chose to stay. For your laugh, your warmth, your patience. For loving me even when I made it hard. I don't take a single moment with you for granted.",
    cta: "Keep going 🦋",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 4,
    name: "My Promises",
    emoji: "💍",
    bg: "from-rose-950 via-black to-pink-950",
    sparkleColor: "#fda4af",
    headline: "I promise you this.",
    body: "",
    cta: "I believe you 🎁",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 5,
    name: "Dil Se",
    emoji: "🎆",
    bg: "from-violet-950 via-black to-fuchsia-950",
    sparkleColor: "#e879f9",
    headline: "Ab sunle Hindi mein 🇮🇳",
    body: "",
    cta: "Chal aage badh 🚀",
    secretMessage: "Tera gussa bhi handle kar lunga, bas tu rehna mere saath 🥺😂",
    cards: false,
    final: false,
  },
  {
    id: 6,
    name: "Our Universe",
    emoji: "🪐",
    bg: "from-black via-indigo-950 to-black",
    sparkleColor: "#818cf8",
    headline: "You're my entire universe.",
    body: "If the whole galaxy was mine, I'd still only look at you. Every star, every planet, every constellation reminds me that the universe made something perfect when it made you.",
    cta: "Take me to the end ✨",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 7,
    name: "Forever Yours",
    emoji: "🌌",
    bg: "from-black via-rose-950 to-black",
    sparkleColor: "#ff6eb0",
    headline: "You're my everything.",
    body: "",
    cta: null as string | null,
    secretMessage: null as string | null,
    cards: false,
    final: true,
  },
] as const;

// ─── Love cards for Level 2 ──────────────────────────────────────────────────

const LOVE_CARDS = [
  {
    title: "Your laugh",
    subtitle: "It's the most contagious sound I've ever heard. One giggle from you and my entire world gets lighter instantly.",
    icon: <span className="text-4xl">😂</span>,
    colors: [[236, 72, 153], [232, 121, 249]] as number[][],
    containerClassName: "bg-black",
  },
  {
    title: "Your kindness",
    subtitle: "The way you care for everyone around you so effortlessly. It makes me want to be a better person every single day.",
    icon: <span className="text-4xl">🤍</span>,
    colors: [[255, 255, 255], [200, 200, 255]] as number[][],
    containerClassName: "bg-slate-900",
  },
  {
    title: "Your strength",
    subtitle: "You carry so much with such quiet grace. You're one of the strongest people I know and you don't even realise it.",
    icon: <span className="text-4xl">💪</span>,
    colors: [[251, 191, 36], [249, 115, 22]] as number[][],
    containerClassName: "bg-amber-950",
  },
  {
    title: "Your mind",
    subtitle: "The way you think, dream and see the world is genuinely breathtaking. I could listen to you talk for hours and never get bored.",
    icon: <span className="text-4xl">🧠</span>,
    colors: [[125, 211, 252], [99, 102, 241]] as number[][],
    containerClassName: "bg-sky-900",
  },
  {
    title: "How you love",
    subtitle: "You love with everything you have. Fully, honestly, without conditions. That kind of love is rare. That's you.",
    icon: <span className="text-4xl">💗</span>,
    colors: [[244, 63, 94], [236, 72, 153]] as number[][],
    containerClassName: "bg-rose-950",
  },
  {
    title: "Just being you",
    subtitle: "Every little weird, wonderful, beautiful thing that makes you Kashish. I wouldn't trade a single second of knowing you.",
    icon: <span className="text-4xl">🌟</span>,
    colors: [[167, 139, 250], [236, 72, 153]] as number[][],
    containerClassName: "bg-purple-950",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-white/10">
    <motion.div
      className="h-full bg-linear-to-r from-pink-500 via-purple-500 to-pink-400"
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  </div>
);

const LevelBadge = ({ level, name }: { level: number; name: string }) => (
  <motion.div
    key={level}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-white/60"
  >
    <span className="text-pink-400 font-bold">Level {level}</span>
    <span className="text-white/30">·</span>
    <span>{name}</span>
  </motion.div>
);

const CONFETTI_DATA = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: seededRand(i) * 100,
  color: ["#ff6eb0", "#c084fc", "#fbbf24", "#34d399", "#60a5fa"][i % 5],
  size: 6 + seededRand(i + 50) * 8,
  delay: seededRand(i + 100) * 0.8,
  duration: 1.5 + seededRand(i + 200) * 1,
}));

const LevelCompleteConfetti = ({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {CONFETTI_DATA.map((c) => (
          <motion.div
            key={c.id}
            initial={{ x: `${c.x}vw`, y: "-5vh", opacity: 1, rotate: 0 }}
            animate={{ y: "110vh", opacity: 0, rotate: 720 }}
            exit={{ opacity: 0 }}
            transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
            className="absolute rounded-sm"
            style={{ width: c.size, height: c.size, backgroundColor: c.color }}
          />
        ))}
      </div>
    )}
  </AnimatePresence>
);

const SecretPopup = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: 40 }}
    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] px-6 py-4 rounded-2xl bg-pink-950/90 border border-pink-400/30 backdrop-blur-sm text-center shadow-2xl shadow-pink-500/20"
  >
    <p className="text-2xl mb-2">🤫</p>
    <p className="text-pink-200 text-sm leading-relaxed">{message}</p>
    <button onClick={onClose} className="mt-3 text-xs text-pink-400/60 hover:text-pink-300 transition-colors">
      close ×
    </button>
  </motion.div>
);

const THANK_YOU_ITEMS = [
  "For every time you believed in me when I couldn't believe in myself 🙏",
  "For every hug that made everything feel okay again 🤗",
  "For every laugh we've shared at the most random moments 😂",
  "For every fight we got through together and came out stronger 💪",
  "For choosing to stay, again and again 💗",
  "For just being you, endlessly 🌟",
];

const PROMISES = [
  { text: "I promise to choose you. Every single day.", emoji: "💫" },
  { text: "I promise to make you feel seen and heard.", emoji: "👁️" },
  { text: "I promise to be your safe place always.", emoji: "🏡" },
  { text: "I promise to match your energy and your love.", emoji: "💞" },
  { text: "I promise you won't regret trusting me.", emoji: "🤝" },
  { text: "I promise to keep making you smile.", emoji: "😊" },
];

const ROSE_PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: seededRand(i * 3) * 100,
  delay: seededRand(i * 3 + 1) * 8,
  duration: 6 + seededRand(i * 3 + 2) * 6,
  size: 10 + seededRand(i * 3 + 3) * 14,
  rotate: seededRand(i * 3 + 4) * 360,
}));

// ─── Main Game Page ───────────────────────────────────────────────────────────

export default function Home() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [secretMsg, setSecretMsg] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [ctaClicked, setCtaClicked] = useState(false);

  const level = LEVELS[currentLevel];
  const totalLevels = LEVELS.length - 1;
  const allCardsRevealed = revealedCards.size >= LOVE_CARDS.length;

  const advanceLevel = useCallback(() => {
    setShowConfetti(true);
    setCtaClicked(false);
    setTimeout(() => setShowConfetti(false), 3000);
    setTimeout(() => {
      setCurrentLevel((l) => Math.min(l + 1, LEVELS.length - 1));
    }, 600);
  }, []);

  const handleCta = useCallback(() => {
    if (level.cards && !allCardsRevealed) return;
    if (level.secretMessage) {
      setSecretMsg(level.secretMessage);
      setShowSecret(true);
    }
    setCtaClicked(true);
    setTimeout(advanceLevel, 400);
  }, [level, allCardsRevealed, advanceLevel]);

  const revealCard = useCallback((idx: number) => {
    setRevealedCards((prev) => new Set([...prev, idx]));
  }, []);

  useEffect(() => {
    const buffer: string[] = [];
    const TARGET = "kashish";
    const handler = (e: KeyboardEvent) => {
      buffer.push(e.key.toLowerCase());
      if (buffer.length > TARGET.length) buffer.shift();
      if (buffer.join("") === TARGET) {
        setSecretMsg("You typed her name 🥺 You really do love her.");
        setShowSecret(true);
        buffer.length = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const gradientBg = `bg-linear-to-b ${level.bg}`;

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <ProgressBar current={currentLevel} total={totalLevels} />
      <LevelBadge level={currentLevel + 1} name={level.name} />
      <LevelCompleteConfetti show={showConfetti} />
      <FloatingEmojis />

      {/* Rose petal rain */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {ROSE_PETALS.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "-10vh", x: `${p.left}vw`, opacity: 0, rotate: 0 }}
            animate={{ y: "110vh", opacity: [0, 0.7, 0.7, 0], rotate: p.rotate }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
            className="absolute text-rose-400"
            style={{ fontSize: p.size }}
          >
            🌸
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showSecret && secretMsg && (
          <SecretPopup message={secretMsg} onClose={() => setShowSecret(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ctaClicked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-pink-400 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentLevel}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >

          {/* ────────── LEVEL 0: The Beginning ────────── */}
          {currentLevel === 0 && (
            <div className="min-h-screen w-full">
              <Vortex
                backgroundColor="#050010"
                className="flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8 pt-16"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }} className="text-8xl">
                  {level.emoji}
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-bold text-white tracking-tight [text-shadow:0_0_40px_rgba(236,72,153,0.4)]">
                  {level.headline}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-xl text-white/70 max-w-lg leading-relaxed">
                  {level.body}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ delay: 1.8, duration: 3, repeat: Infinity }}
                  className="text-pink-300/40 text-sm italic"
                >
                  made with love, just for you 🌹
                </motion.p>
                <FlowerBurst mode="mixed" burstCount={16}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring" }}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                    onClick={handleCta}
                    className="px-10 py-4 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 transition-shadow"
                  >
                    {level.cta}
                  </motion.button>
                </FlowerBurst>
              </Vortex>
            </div>
          )}

          {/* ────────── LEVEL 1: Apology ────────── */}
          {currentLevel === 1 && (
            <HeroHighlight containerClassName={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-10 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={40} particleColor={level.sparkleColor} speed={0.5} background="transparent" />
              </div>
              <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 150, delay: 0.2 }} className="text-7xl">
                {level.emoji}
              </motion.div>
              <div className="relative z-10 max-w-2xl">
                <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {level.headline}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-lg md:text-xl text-white/80 leading-relaxed"
                >
                  I know I haven&apos;t always been perfect. I&apos;ve said things I shouldn&apos;t have,
                  and not said things I should have. You deserved better from me in those moments.
                  And I&apos;m working on it{" "}
                  <Highlight>every single day</Highlight>
                  {" "}because{" "}
                  <Highlight>YOU are worth it</Highlight>.
                </motion.p>
              </div>
              <motion.div animate={{ rotate: [0, -3, 3, -3, 3, 0] }} transition={{ duration: 0.5, delay: 1.5, repeat: 3, repeatDelay: 2 }} className="text-5xl">🌹</motion.div>
              <FlowerBurst mode="flowers" burstCount={20}>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, type: "spring" }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="px-10 py-4 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white font-bold text-lg shadow-2xl shadow-rose-500/30">
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </HeroHighlight>
          )}

          {/* ────────── LEVEL 2: Love Cards ────────── */}
          {currentLevel === 2 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center px-4 pt-20 pb-16 gap-10 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={50} particleColor={level.sparkleColor} speed={0.6} background="transparent" />
              </div>
              <div className="relative z-10 text-center max-w-xl mt-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl mb-4">{level.emoji}</motion.div>
                {/* Colour-cycling headline words */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mb-3">
                  {["Let", "me", "count", "the", "ways", "💕"].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 200 }}
                      className="text-3xl md:text-5xl font-bold"
                      style={{
                        color: [
                          "#f472b6", "#c084fc", "#fb7185", "#a78bfa", "#f9a8d4", "#fff"
                        ][i],
                        textShadow: `0 0 20px ${["#f472b6", "#c084fc", "#fb7185", "#a78bfa", "#f9a8d4", "#fff"][i]}60`,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="text-pink-200/70 text-lg">{level.body}</motion.p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {LOVE_CARDS.map((_, i) => (
                    <motion.div key={i} animate={{ scale: revealedCards.has(i) ? 1.3 : 1, backgroundColor: revealedCards.has(i) ? "#ec4899" : "rgba(255,255,255,0.15)" }} className="h-2 w-2 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-2">
                {LOVE_CARDS.map((card, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + idx * 0.1 }}>
                    <LoveRevealCard card={card} revealed={revealedCards.has(idx)} onReveal={() => revealCard(idx)} />
                  </motion.div>
                ))}
              </div>
              <AnimatePresence>
                {allCardsRevealed && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
                    <FlowerBurst mode="flowers" burstCount={22}>
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="px-10 py-4 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-purple-500/30">
                        {level.cta}
                      </motion.button>
                    </FlowerBurst>
                  </motion.div>
                )}
              </AnimatePresence>
              {!allCardsRevealed && (
                <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }} className="text-pink-300/50 text-sm relative z-10">
                  {LOVE_CARDS.length - revealedCards.size} card{LOVE_CARDS.length - revealedCards.size !== 1 ? "s" : ""} left to unlock…
                </motion.p>
              )}
            </div>
          )}

          {/* ────────── LEVEL 3: Thank You ────────── */}
          {currentLevel === 3 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-10 text-center gap-6 relative overflow-hidden`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={60} particleColor={level.sparkleColor} speed={0.7} background="transparent" />
              </div>
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, delay: 0.2 }} className="text-6xl">{level.emoji}</motion.div>
              <div className="relative z-10 max-w-2xl">
                <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl md:text-5xl font-bold text-white mb-6">{level.headline}</motion.h2>
                {THANK_YOU_ITEMS.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.18 }} className="text-white/80 text-base py-2 border-b border-white/10 last:border-0 text-left">{item}</motion.div>
                ))}
              </div>
              {/* Interactive Globe */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-xs mx-auto"
              >
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 blur-3xl" />
                <p className="text-white/30 text-xs mb-1">our world 🌍</p>
                <World
                  globeConfig={{ autoRotate: true, autoRotateSpeed: 0.6 }}
                  data={[
                    { startLat: 28.6139, startLng: 77.209, endLat: 28.6, endLng: 77.2, arcAlt: 0.1, color: "#f472b6" },
                    { startLat: 51.5072, startLng: -0.1276, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: "#c084fc" },
                    { startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: "#818cf8" },
                  ]}
                />
              </motion.div>
              <FlowerBurst mode="mixed" burstCount={18}>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, type: "spring" }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="relative z-10 px-10 py-4 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30">
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 4: My Promises ────────── */}
          {currentLevel === 4 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-8 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={70} particleColor="#fda4af" speed={0.7} background="transparent" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1], rotate: [0, 20, 0] }}
                transition={{ duration: 0.9, delay: 0.2, type: "spring" }}
                className="text-7xl relative z-10"
              >
                {level.emoji}
              </motion.div>
              <div className="relative z-10 max-w-lg w-full">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-8 [text-shadow:0_0_30px_rgba(253,164,175,0.4)]"
                >
                  {level.headline}
                </motion.h2>
                <div className="flex flex-col gap-3">
                  {PROMISES.map((promise, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -40, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 180 }}
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/5 border border-rose-400/20 backdrop-blur-sm hover:border-rose-400/40 hover:bg-white/8 transition-all"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, delay: 0.8 + i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-2xl shrink-0"
                      >
                        {promise.emoji}
                      </motion.span>
                      <p className="text-white/85 text-left text-base leading-snug">{promise.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              <FlowerBurst mode="hearts" burstCount={26}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, type: "spring" }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCta}
                  className="relative z-10 px-10 py-4 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-2xl shadow-rose-500/30"
                >
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 5: Hindi + Fireworks 🎆 ────────── */}
          {currentLevel === 5 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-8 relative overflow-hidden`}>
              {/* FIREWORKS BACKGROUND */}
              <FireworksDisplay />

              <div className="absolute inset-0 pointer-events-none z-1">
                <SparklesCore particleDensity={70} particleColor={level.sparkleColor} speed={0.8} background="transparent" />
              </div>

              {/* Main emoji */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: [0, 1.4, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="text-8xl relative z-10"
              >
                {level.emoji}
              </motion.div>

              {/* Hindi headline with glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="relative z-10"
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 [text-shadow:0_0_30px_rgba(232,121,249,0.5)]">
                  {level.headline}
                </h2>
                {/* Pulsing Namaste emoji */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  className="text-5xl mt-2"
                >
                  🙏
                </motion.div>
              </motion.div>

              {/* Hindi text reveal lines */}
              <div className="relative z-10">
                <HindiTextReveal />
              </div>

              {/* Desi decorative touch */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                className="relative z-10 flex gap-4 text-3xl"
              >
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>🪷</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>🎇</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>🪷</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}>🎇</motion.span>
                <motion.span animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}>🪷</motion.span>
              </motion.div>

              <FlowerBurst mode="mixed" burstCount={22}>
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.5, type: "spring" }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCta}
                  className="relative z-10 px-10 py-4 rounded-full bg-linear-to-r from-fuchsia-500 to-violet-600 text-white font-bold text-lg shadow-2xl shadow-fuchsia-500/30 [text-shadow:0_0_10px_rgba(255,255,255,0.3)]"
                >
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 6: Our Universe 🪐 ────────── */}
          {currentLevel === 6 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-8 relative overflow-hidden`}>
              {/* GALAXY BACKGROUND */}
              <GalaxyAnimation />

              {/* Central content */}
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1.2, type: "spring", stiffness: 100 }}
                className="text-8xl relative z-10"
              >
                {level.emoji}
              </motion.div>

              <div className="relative z-10 max-w-2xl">
                {/* Glowing headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6 [text-shadow:0_0_40px_rgba(129,140,248,0.5)]"
                >
                  {level.headline}
                </motion.h2>

                {/* Text with typewriter feel */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                  <TextGenerateEffect words={level.body} className="text-lg md:text-xl text-white/80 leading-relaxed font-normal" filter duration={0.5} />
                </motion.div>

                {/* Animated "you are here" marker */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="mt-8 flex flex-col items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <div className="w-4 h-4 rounded-full bg-pink-500 relative">
                      <motion.div
                        animate={{ scale: [1, 3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-pink-500"
                      />
                    </div>
                  </motion.div>
                  <p className="text-pink-300/60 text-xs">← Kashish is here (center of my universe)</p>
                </motion.div>
              </div>

              <FlowerBurst mode="hearts" burstCount={20}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3, type: "spring" }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCta}
                  className="relative z-10 px-10 py-4 rounded-full bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 [text-shadow:0_0_10px_rgba(255,255,255,0.3)]"
                >
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 7: FINAL ────────── */}
          {currentLevel === 7 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-6 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={120} particleColor="#ff6eb0" speed={1} background="transparent" />
              </div>
              <motion.div
                animate={{ rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="text-8xl relative z-10"
              >
                {level.emoji}
              </motion.div>
              <div className="relative z-10 max-w-2xl">
                {/* Gradient shimmer headline */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-4"
                >
                  <div className="relative mx-auto inline-block w-max filter-[drop-shadow(0px_1px_3px_rgba(236,72,153,0.4))]">
                    <div className="absolute left-0 top-px bg-clip-text bg-no-repeat text-transparent bg-linear-to-r py-2 from-pink-400 via-purple-400 to-rose-400">
                      <span className="text-3xl md:text-6xl font-bold">Kashish, I love you.</span>
                    </div>
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-linear-to-r from-pink-400 via-purple-400 to-rose-400 py-2">
                      <span className="text-3xl md:text-6xl font-bold">Kashish, I love you.</span>
                    </div>
                  </div>
                </motion.div>

                {/* Animated quote lines */}
                {[
                  "You walked into my life and made it so much warmer.",
                  "I don't want forever with anyone else. Only you.",
                  "Thank you for being exactly who you are.",
                ].map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.35 }}
                    className="text-white/60 text-base italic mb-2"
                  >
                    &quot;{line}&quot;
                  </motion.p>
                ))}

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  className="mt-4 text-pink-300 font-semibold text-2xl"
                >
                  You&apos;re the best, my baby girl 😘😘😘
                </motion.p>

                {/* Our photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.9, duration: 0.8, ease: "easeOut" }}
                  className="mt-6 relative group"
                >
                  <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.04, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-1 rounded-3xl bg-linear-to-r from-pink-500 via-rose-400 to-purple-500 blur-lg"
                  />
                  <div className="relative rounded-3xl overflow-hidden border-2 border-pink-400/30 shadow-2xl shadow-pink-500/20">
                    <Image
                      src="/couple.jpg"
                      alt="Us 💖"
                      width={380}
                      height={500}
                      className="object-cover w-full max-w-xs mx-auto"
                      priority
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent px-4 py-5">
                      <p className="text-white/90 text-sm font-medium">us 🥰💗</p>
                    </div>
                  </div>
                </motion.div>

                {/* Beating hearts row */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 }}
                  className="mt-6 flex justify-center gap-3"
                >
                  {["💖", "💗", "💖", "💗", "💖"].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, repeatDelay: 1.5 }}
                      className="text-2xl"
                    >
                      {h}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2 }}
                onClick={() => { setCurrentLevel(0); setRevealedCards(new Set()); setCtaClicked(false); }}
                className="relative z-10 text-sm text-white/25 hover:text-white/50 transition-colors underline underline-offset-4"
              >
                Play again from the beginning 🔄
              </motion.button>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </main>
  );
}
