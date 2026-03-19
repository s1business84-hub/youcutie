"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { SparklesCore } from "@/components/ui/sparkles";
import { FlowerBurst, FloatingEmojis } from "@/components/ui/flower-burst";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { LoveRevealCard } from "@/components/ui/love-reveal-card";
import { FireworksDisplay, GalaxyAnimation, HindiTextReveal } from "@/components/ui/fireworks-galaxy";

// ─── Game Level Definitions (8 levels) ──────────────────────────────────────

const LEVELS = [
  {
    id: 0,
    name: "The Beginning",
    emoji: "💌",
    bg: "from-rose-950 via-black to-pink-950",
    sparkleColor: "#ff6eb0",
    headline: "Hey Kashish…",
    body: "I made you something. Something only you deserve. Are you ready to unlock it?",
    cta: "Open my heart 💖",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 1,
    name: "I'm Sorry",
    emoji: "🌹",
    bg: "from-red-950 via-black to-rose-950",
    sparkleColor: "#ff4466",
    headline: "I'm genuinely sorry.",
    body: "I know I haven't always been perfect. I've said things I shouldn't have, and not said things I should have. You deserved better from me in those moments — and I'm working on it every single day because YOU are worth it.",
    cta: "I forgive you 🌹",
    secretMessage: "The fact that you're still here means the world to me. 🥺",
    cards: false,
    final: false,
  },
  {
    id: 2,
    name: "Things I Love About You",
    emoji: "🌸",
    bg: "from-purple-950 via-black to-pink-950",
    sparkleColor: "#c084fc",
    headline: "Let me count the ways…",
    body: "Tap every card to unlock what I love about you.",
    cta: "I unlocked them all! 💕",
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
    body: "For every late-night conversation. For every time you chose to stay. For your laugh, your warmth, your patience. For loving me even when I made it hard. I don't take a single moment with you for granted.",
    cta: "Keep going 🦋",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  {
    id: 4,
    name: "My Promise",
    emoji: "💍",
    bg: "from-amber-950 via-black to-rose-950",
    sparkleColor: "#fbbf24",
    headline: "Here's my promise to you.",
    body: "I promise to choose you. Every single day. To make you feel seen, loved, and safe. To be the person who matches your energy and loves you the way you've always deserved. You're my person, Kashish.",
    cta: "Collect your reward 🎁",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  // ─── NEW LEVEL 5: Hindi / Fireworks ───
  {
    id: 5,
    name: "Tu Meri Jaan Hai",
    emoji: "🎆",
    bg: "from-violet-950 via-black to-fuchsia-950",
    sparkleColor: "#e879f9",
    headline: "Ab sunle Hindi mein… 🇮🇳",
    body: "",
    cta: "Chal aage badh 🚀",
    secretMessage: "Tera gussa bhi handle kar lunga, bas tu rehna mere saath 🥺😂",
    cards: false,
    final: false,
  },
  // ─── NEW LEVEL 6: Galaxy / Our Universe ───
  {
    id: 6,
    name: "Our Universe",
    emoji: "🪐",
    bg: "from-black via-indigo-950 to-black",
    sparkleColor: "#818cf8",
    headline: "You're my entire universe.",
    body: "If the whole galaxy was mine, I'd still only look at you. Every star, every planet, every constellation reminds me that the universe made something perfect when it made you.",
    cta: "Take me to the finale ✨",
    secretMessage: null as string | null,
    cards: false,
    final: false,
  },
  // ─── FINAL LEVEL (now 7) ───
  {
    id: 7,
    name: "You're My Everything",
    emoji: "🌌",
    bg: "from-black via-rose-950 to-black",
    sparkleColor: "#ff6eb0",
    headline: "You're my everything.",
    body: "From the bottom of my heart, I love you more than any words or website could ever show. But I made this just for you, because you deserve all the flowers in the world. 🌸\n\nYou're the best, my baby girl 😘😘😘",
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
    subtitle: "It's the most contagious thing I've ever heard. One giggle and my entire world gets lighter.",
    icon: <span className="text-4xl">😂</span>,
    colors: [[236, 72, 153], [232, 121, 249]] as number[][],
    containerClassName: "bg-black",
  },
  {
    title: "Your kindness",
    subtitle: "You care about everyone around you so deeply — it makes me want to be a better person every day.",
    icon: <span className="text-4xl">🤍</span>,
    colors: [[255, 255, 255], [200, 200, 255]] as number[][],
    containerClassName: "bg-slate-900",
  },
  {
    title: "Your strength",
    subtitle: "You carry so much with so much grace. You're one of the strongest people I know and you don't even realise it.",
    icon: <span className="text-4xl">💪</span>,
    colors: [[251, 191, 36], [249, 115, 22]] as number[][],
    containerClassName: "bg-amber-950",
  },
  {
    title: "Your mind",
    subtitle: "The way you think, dream, and see the world is genuinely breathtaking. I could listen to you talk for hours.",
    icon: <span className="text-4xl">🧠</span>,
    colors: [[125, 211, 252], [99, 102, 241]] as number[][],
    containerClassName: "bg-sky-900",
  },
  {
    title: "The way you love",
    subtitle: "You love with everything you have — fully, honestly, and without conditions. That's rare. That's you.",
    icon: <span className="text-4xl">💗</span>,
    colors: [[244, 63, 94], [236, 72, 153]] as number[][],
    containerClassName: "bg-rose-950",
  },
  {
    title: "You being you",
    subtitle: "Every little weird, wonderful, beautiful thing that makes you Kashish. I wouldn't change a single thing.",
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
  "For every time you believed in me 🙏",
  "For every hug when I needed it most 🤗",
  "For every laugh we shared 😂",
  "For every fight we made it through 💪",
  "For just being YOU — endlessly 💗",
];

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
            <BackgroundBeamsWithCollision className={`min-h-screen ${gradientBg}`}>
              <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center gap-8 pt-16">
                <div className="absolute inset-0 pointer-events-none">
                  <SparklesCore particleDensity={80} particleColor={level.sparkleColor} minSize={0.6} maxSize={1.8} speed={0.8} background="transparent" />
                </div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.3 }} className="text-8xl">
                  {level.emoji}
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                  {level.headline}
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="text-xl text-white/70 max-w-lg leading-relaxed">
                  {level.body}
                </motion.p>
                <FlowerBurst mode="mixed" burstCount={16}>
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, type: "spring" }}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                    onClick={handleCta}
                    className="px-10 py-4 rounded-full bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-shadow"
                  >
                    {level.cta}
                  </motion.button>
                </FlowerBurst>
              </div>
            </BackgroundBeamsWithCollision>
          )}

          {/* ────────── LEVEL 1: Apology ────────── */}
          {currentLevel === 1 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-10 relative`}>
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                  <TextGenerateEffect words={level.body} className="text-lg md:text-xl text-white/80 leading-relaxed font-normal" filter duration={0.4} />
                </motion.div>
              </div>
              <motion.div animate={{ rotate: [0, -3, 3, -3, 3, 0] }} transition={{ duration: 0.5, delay: 1.5, repeat: 3, repeatDelay: 2 }} className="text-5xl">🌹</motion.div>
              <FlowerBurst mode="flowers" burstCount={20}>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, type: "spring" }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="px-10 py-4 rounded-full bg-linear-to-r from-rose-500 to-pink-600 text-white font-bold text-lg shadow-2xl shadow-rose-500/30">
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 2: Love Cards ────────── */}
          {currentLevel === 2 && (
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center px-4 pt-20 pb-16 gap-10 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={50} particleColor={level.sparkleColor} speed={0.6} background="transparent" />
              </div>
              <div className="relative z-10 text-center max-w-xl mt-4">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-6xl mb-4">{level.emoji}</motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl md:text-5xl font-bold text-white mb-3">{level.headline}</motion.h2>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/60 text-lg">{level.body}</motion.p>
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
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-10 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={60} particleColor={level.sparkleColor} speed={0.7} background="transparent" />
              </div>
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, delay: 0.2 }} className="text-7xl">{level.emoji}</motion.div>
              <div className="relative z-10 max-w-2xl">
                <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-6xl font-bold text-white mb-8">{level.headline}</motion.h2>
                {THANK_YOU_ITEMS.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.18 }} className="text-white/80 text-lg py-2.5 border-b border-white/10 last:border-0 text-left">{item}</motion.div>
                ))}
              </div>
              <FlowerBurst mode="mixed" burstCount={18}>
                <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, type: "spring" }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="px-10 py-4 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30">
                  {level.cta}
                </motion.button>
              </FlowerBurst>
            </div>
          )}

          {/* ────────── LEVEL 4: My Promise ────────── */}
          {currentLevel === 4 && (
            <BackgroundBeamsWithCollision className={`min-h-screen ${gradientBg}`}>
              <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-16 text-center gap-10">
                <div className="absolute inset-0 pointer-events-none">
                  <SparklesCore particleDensity={50} particleColor={level.sparkleColor} speed={0.6} background="transparent" />
                </div>
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.8, delay: 0.3 }} className="text-7xl">{level.emoji}</motion.div>
                <div className="relative z-10 max-w-2xl">
                  <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-4xl md:text-6xl font-bold text-white mb-6">{level.headline}</motion.h2>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                    <TextGenerateEffect words={level.body} className="text-lg md:text-xl text-white/80 leading-relaxed font-normal" filter duration={0.4} />
                  </motion.div>
                </div>
                <FlowerBurst mode="hearts" burstCount={24}>
                  <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4, type: "spring" }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={handleCta} className="px-10 py-4 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white font-bold text-lg shadow-2xl shadow-amber-500/30">
                    {level.cta}
                  </motion.button>
                </FlowerBurst>
              </div>
            </BackgroundBeamsWithCollision>
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
            <div className={`min-h-screen ${gradientBg} flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center gap-8 relative`}>
              <div className="absolute inset-0 pointer-events-none">
                <SparklesCore particleDensity={120} particleColor="#ff6eb0" speed={1} background="transparent" />
              </div>
              <motion.div animate={{ rotate: [0, 10, -10, 10, -10, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} className="text-8xl relative z-10">
                {level.emoji}
              </motion.div>
              <div className="relative z-10 max-w-2xl">
                {/* Gradient text headline */}
                <div className="relative mx-auto inline-block w-max filter-[drop-shadow(0px_1px_3px_rgba(236,72,153,0.4))] mb-6">
                  <div className="absolute left-0 top-px bg-clip-text bg-no-repeat text-transparent bg-linear-to-r py-2 from-pink-400 via-purple-400 to-rose-400 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                    <span className="text-3xl md:text-6xl font-bold">Kashish, I love you.</span>
                  </div>
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-linear-to-r from-pink-400 via-purple-400 to-rose-400 py-2">
                    <span className="text-3xl md:text-6xl font-bold">Kashish, I love you.</span>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-xl text-white/70 leading-relaxed">
                  <p>From the bottom of my heart, I love you more than any words or website could ever show. But I made this just for you, because you deserve all the flowers in the world. 🌸</p>
                  <p className="mt-4 text-pink-300 font-semibold text-2xl">You&apos;re the best, my baby girl 😘😘😘</p>
                </motion.div>

                {/* Our photo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                  className="mt-8 relative group"
                >
                  {/* Glow ring */}
                  <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-1 rounded-3xl bg-linear-to-r from-pink-500 via-purple-500 to-rose-500 blur-lg"
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
                    {/* Overlay label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-4 py-4">
                      <p className="text-white/80 text-sm font-medium">Us 💖</p>
                    </div>
                  </div>
                </motion.div>

                {/* Big heart pulse */}
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} className="text-6xl mt-6">💖</motion.div>
              </div>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                onClick={() => { setCurrentLevel(0); setRevealedCards(new Set()); setCtaClicked(false); }}
                className="relative z-10 text-sm text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
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
