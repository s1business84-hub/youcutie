"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const SparklesCore = ({
  id,
  className,
  background,
  minSize = 0.4,
  maxSize = 1.4,
  particleDensity = 60,
  particleColor = "#FFF",
  speed = 1,
}: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}) => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: particleDensity }, (_, i) => ({
        id: i,
        x: seededRand(i) * 100,
        y: seededRand(i + 500) * 100,
        size: seededRand(i + 1000) * (maxSize - minSize) + minSize,
        delay: seededRand(i + 1500) * 2,
        duration: (seededRand(i + 2000) * 2 + 1) / speed,
      })),
    [particleDensity, minSize, maxSize, speed]
  );

  return (
    <div id={id} className={cn("relative w-full h-full overflow-hidden", className)} style={{ background }}>
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size * 4,
            height: s.size * 4,
            backgroundColor: particleColor,
            boxShadow: `0 0 ${s.size * 6}px ${particleColor}`,
          }}
        />
      ))}
    </div>
  );
};
