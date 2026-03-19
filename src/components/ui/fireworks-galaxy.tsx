"use client";
import React from "react";
import { motion } from "framer-motion";

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ─── Pre-built data ──────────────────────────────────────────────────────────

const FIREWORK_COLORS = [
  "#ff6eb0", "#c084fc", "#fbbf24", "#34d399", "#60a5fa",
  "#f472b6", "#a78bfa", "#fb923c", "#22d3ee", "#e879f9",
];

const FIREWORK_BURSTS = Array.from({ length: 8 }, (_, burstIdx) => ({
  id: burstIdx,
  cx: 10 + seededRand(burstIdx) * 80,
  cy: 15 + seededRand(burstIdx + 100) * 50,
  delay: burstIdx * 0.6 + seededRand(burstIdx + 200) * 0.4,
  particles: Array.from({ length: 18 }, (_, pIdx) => {
    const seed = burstIdx * 100 + pIdx;
    const angle = (360 / 18) * pIdx + seededRand(seed + 50) * 20;
    const dist = 80 + seededRand(seed + 60) * 120;
    return {
      id: pIdx,
      angle,
      dx: Math.cos((angle * Math.PI) / 180) * dist,
      dy: Math.sin((angle * Math.PI) / 180) * dist,
      color: FIREWORK_COLORS[pIdx % FIREWORK_COLORS.length],
      size: 3 + seededRand(seed + 70) * 5,
      dur: 1 + seededRand(seed + 80) * 0.8,
      trailLength: 20 + seededRand(seed + 90) * 30,
    };
  }),
}));

const ROCKET_TRAILS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  startX: 10 + seededRand(i + 300) * 80,
  delay: i * 0.6 + seededRand(i + 400) * 0.4,
  endY: 15 + seededRand(i + 100) * 50,
}));

// ─── Component ────────────────────────────────────────────────────────────────

export const FireworksDisplay = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Rocket trails going up */}
      {ROCKET_TRAILS.map((rocket) => (
        <motion.div
          key={`rocket-${rocket.id}`}
          initial={{ x: `${rocket.startX}%`, y: "100%", opacity: 0 }}
          animate={{
            y: `${rocket.endY}%`,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: rocket.delay,
            repeat: Infinity,
            repeatDelay: FIREWORK_BURSTS.length * 0.6 + 1.5,
            ease: "easeOut",
          }}
          className="absolute w-0.5 h-8 bg-linear-to-t from-transparent via-amber-300 to-white rounded-full"
        />
      ))}

      {/* Firework bursts */}
      {FIREWORK_BURSTS.map((burst) => (
        <div
          key={`burst-${burst.id}`}
          className="absolute"
          style={{ left: `${burst.cx}%`, top: `${burst.cy}%` }}
        >
          {burst.particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
              animate={{
                x: [0, p.dx * 0.3, p.dx],
                y: [0, p.dy * 0.3, p.dy + 20],
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.3],
              }}
              transition={{
                duration: p.dur + 0.5,
                delay: burst.delay + 0.8,
                repeat: Infinity,
                repeatDelay: FIREWORK_BURSTS.length * 0.6 + 0.5,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}50`,
              }}
            />
          ))}
          {/* Center flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 3, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.6,
              delay: burst.delay + 0.75,
              repeat: Infinity,
              repeatDelay: FIREWORK_BURSTS.length * 0.6 + 1.2,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white"
            style={{ boxShadow: "0 0 30px #fff, 0 0 60px #ff6eb0, 0 0 90px #c084fc" }}
          />
        </div>
      ))}
    </div>
  );
};

// ─── Galaxy / Orbit Animation ─────────────────────────────────────────────────

const STAR_FIELD = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  x: seededRand(i + 500) * 100,
  y: seededRand(i + 600) * 100,
  size: seededRand(i + 700) * 2 + 0.5,
  opacity: 0.3 + seededRand(i + 800) * 0.7,
  twinkleDur: 2 + seededRand(i + 900) * 4,
  twinkleDelay: seededRand(i + 1000) * 5,
}));

const ORBIT_ITEMS = [
  { emoji: "💖", radius: 120, speed: 8, offset: 0, size: 28 },
  { emoji: "🌸", radius: 120, speed: 8, offset: 120, size: 22 },
  { emoji: "✨", radius: 120, speed: 8, offset: 240, size: 20 },
  { emoji: "💕", radius: 180, speed: 12, offset: 45, size: 24 },
  { emoji: "🌹", radius: 180, speed: 12, offset: 165, size: 26 },
  { emoji: "💗", radius: 180, speed: 12, offset: 285, size: 22 },
  { emoji: "🦋", radius: 240, speed: 16, offset: 90, size: 22 },
  { emoji: "🌺", radius: 240, speed: 16, offset: 210, size: 20 },
  { emoji: "💜", radius: 240, speed: 16, offset: 330, size: 24 },
];

const NEBULA_CLOUDS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: seededRand(i + 1100) * 80 + 10,
  y: seededRand(i + 1200) * 60 + 20,
  size: 150 + seededRand(i + 1300) * 200,
  color: [
    "rgba(236,72,153,0.08)",
    "rgba(167,139,250,0.06)",
    "rgba(99,102,241,0.07)",
    "rgba(244,63,94,0.05)",
    "rgba(232,121,249,0.06)",
    "rgba(251,191,36,0.04)",
  ][i],
  dur: 10 + seededRand(i + 1400) * 15,
}));

export const GalaxyAnimation = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Stars */}
    {STAR_FIELD.map((s) => (
      <motion.div
        key={s.id}
        animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
        transition={{ duration: s.twinkleDur, delay: s.twinkleDelay, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full bg-white"
        style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
      />
    ))}

    {/* Nebula clouds */}
    {NEBULA_CLOUDS.map((n) => (
      <motion.div
        key={n.id}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, -20, 0],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: n.dur, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full blur-3xl"
        style={{
          left: `${n.x}%`,
          top: `${n.y}%`,
          width: n.size,
          height: n.size,
          backgroundColor: n.color,
        }}
      />
    ))}

    {/* Orbit rings (visual only) */}
    {[120, 180, 240].map((r) => (
      <div
        key={r}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        style={{ width: r * 2, height: r * 2 }}
      />
    ))}

    {/* Orbiting items */}
    {ORBIT_ITEMS.map((item, idx) => (
      <motion.div
        key={idx}
        animate={{ rotate: 360 }}
        transition={{ duration: item.speed, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2"
        style={{
          width: item.radius * 2,
          height: item.radius * 2,
          marginLeft: -item.radius,
          marginTop: -item.radius,
        }}
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: item.speed, repeat: Infinity, ease: "linear" }}
          className="absolute"
          style={{
            fontSize: item.size,
            left: "50%",
            top: 0,
            transform: `rotate(${item.offset}deg) translateX(-50%)`,
            transformOrigin: `50% ${item.radius}px`,
          }}
        >
          {item.emoji}
        </motion.div>
      </motion.div>
    ))}

    {/* Central glow */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
      style={{
        background: "radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(167,139,250,0.15) 40%, transparent 70%)",
        boxShadow: "0 0 80px 40px rgba(236,72,153,0.1)",
      }}
    />
  </div>
);

// ─── Scroll-triggered text reveal ─────────────────────────────────────────────

const HINDI_LINES = [
  { text: "Acha jaan suno, ek baat bolun? 🤗", delay: 0 },
  { text: "Tu meri jaan hai, mera dil hai tu 💗", delay: 0.5 },
  { text: "Teri smile se roshan hai mera kal 🌟", delay: 1.0 },
  { text: "Bina tere adhoora hai mera har pal 🥺", delay: 1.5 },
  { text: "Gussa bhi karti hai toh cute lagti hai 😢🤣", delay: 2.0 },
  { text: "No worries jaan, manana mujhe aata hai 😘", delay: 2.5 },
];

export const HindiTextReveal = () => (
  <div className="flex flex-col items-center gap-6 w-full max-w-lg">
    {HINDI_LINES.map((line, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: line.delay + 0.5,
          duration: 0.6,
          type: "spring",
          stiffness: 120,
        }}
        className="relative"
      >
        <motion.p
          className="text-xl md:text-2xl text-white/90 font-medium text-center leading-relaxed"
          animate={i === 3 ? { rotate: [0, -2, 2, -2, 0] } : {}}
          transition={i === 3 ? { duration: 0.5, delay: 2, repeat: 3, repeatDelay: 3 } : {}}
        >
          {line.text}
        </motion.p>
        {i === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.5, type: "spring" }}
            className="absolute -right-8 -top-4 text-2xl"
          >
            😜
          </motion.div>
        )}
      </motion.div>
    ))}
  </div>
);
