"use client";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Pre-seed random values deterministically to avoid React Compiler issues
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const dots = useMemo(() => {
    const rows = 20;
    const cols = 30;
    return Array.from({ length: rows * cols }, (_, idx) => {
      const i = Math.floor(idx / cols);
      const j = idx % cols;
      const r1 = seededRand(idx);
      const r2 = seededRand(idx + 1000);
      const r3 = seededRand(idx + 2000);
      const colorIdx = Math.floor(r1 * colors.length);
      const c = colors[colorIdx];
      return {
        x: (j / cols) * 100,
        y: (i / rows) * 100,
        color: `rgb(${c[0]},${c[1]},${c[2]})`,
        opacity: opacities[Math.floor(r2 * opacities.length)],
        delay: r3 * (1 / animationSpeed),
        size: dotSize ?? 3,
      };
    });
  }, [colors, opacities, animationSpeed, dotSize]);

  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full absolute inset-0">
        {dots.map((dot, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.opacity }}
            transition={{ duration: 0.5 / animationSpeed, delay: dot.delay, ease: "easeInOut" }}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              backgroundColor: dot.color,
            }}
          />
        ))}
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 to-84%" />
      )}
    </div>
  );
};
