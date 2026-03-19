"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FLOWER_EMOJIS = ["🌸", "🌺", "🌹", "🌷", "💐", "🌻", "🌼", "💮", "🏵️", "❀"];
const HEART_EMOJIS = ["💖", "💗", "💕", "💝", "💘", "💞", "❤️", "🩷", "🩵", "💜"];
const ALL_EMOJIS = [...FLOWER_EMOJIS, ...HEART_EMOJIS];

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  angle: number;
  distance: number;
  rotation: number;
  scale: number;
  dur: number;
}

let particleCounter = 0;

export const FlowerBurst = ({
  children,
  className,
  burstCount = 14,
  mode = "flowers",
}: {
  children: React.ReactNode;
  className?: string;
  burstCount?: number;
  mode?: "flowers" | "hearts" | "mixed";
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const emojiPool = mode === "flowers" ? FLOWER_EMOJIS : mode === "hearts" ? HEART_EMOJIS : ALL_EMOJIS;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const base = particleCounter;
      particleCounter += burstCount;

      const newParticles: Particle[] = Array.from({ length: burstCount }, (_, i) => {
        const seed = base + i;
        return {
          id: seed,
          x: cx,
          y: cy,
          emoji: emojiPool[Math.floor(seededRand(seed) * emojiPool.length)],
          angle: (360 / burstCount) * i + seededRand(seed + 300) * 30,
          distance: 60 + seededRand(seed + 400) * 120,
          rotation: seededRand(seed + 500) * 720 - 360,
          scale: 0.5 + seededRand(seed + 600) * 1,
          dur: 0.8 + seededRand(seed + 700) * 0.8,
        };
      });

      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        const ids = new Set(newParticles.map((n) => n.id));
        setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
      }, 2000);
    },
    [burstCount, emojiPool]
  );

  return (
    <div className={`relative select-none cursor-pointer ${className ?? ""}`} onClick={handleClick}>
      {children}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, opacity: 1, scale: 0, rotate: 0 }}
            animate={{
              x: p.x + Math.cos((p.angle * Math.PI) / 180) * p.distance,
              y: p.y + Math.sin((p.angle * Math.PI) / 180) * p.distance - 30,
              opacity: 0,
              scale: p.scale,
              rotate: p.rotation,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: p.dur, ease: "easeOut" }}
            className="absolute pointer-events-none z-50 text-2xl"
            style={{ left: 0, top: 0 }}
          >
            {p.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Static pre-built items at module level — no mutations inside components
const FLOAT_EMOJIS = ["🌸", "💖", "🌺", "💕", "🌹", "✨", "🦋", "💗"];
const FLOAT_ITEMS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  emoji: FLOAT_EMOJIS[i % FLOAT_EMOJIS.length],
  x: seededRand(i) * 100,
  duration: 8 + seededRand(i + 100) * 12,
  delay: seededRand(i + 200) * 10,
  size: 16 + seededRand(i + 300) * 20,
  sway: (20 + seededRand(i + 400) * 40) / 5,
}));

export const FloatingEmojis = ({ items = FLOAT_ITEMS }: { items?: typeof FLOAT_ITEMS }) => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {items.map((item) => (
      <motion.div
        key={item.id}
        initial={{ x: `${item.x}vw`, y: "105vh", opacity: 0 }}
        animate={{
          y: "-10vh",
          opacity: [0, 0.7, 0.7, 0],
          x: [
            `${item.x}vw`,
            `${item.x + item.sway}vw`,
            `${item.x - item.sway}vw`,
            `${item.x}vw`,
          ],
        }}
        transition={{
          duration: item.duration,
          delay: item.delay,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        }}
        className="absolute"
        style={{ fontSize: item.size }}
      >
        {item.emoji}
      </motion.div>
    ))}
  </div>
);
