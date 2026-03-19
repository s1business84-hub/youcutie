"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

// Icon used in corner accents
export const PlusIcon = ({ className, ...rest }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
    {...rest}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
  </svg>
);

export interface LoveCard {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colors: number[][];
  containerClassName: string;
}

export const LoveRevealCard = ({
  card,
  onReveal,
  revealed,
}: {
  card: LoveCard;
  onReveal: () => void;
  revealed: boolean;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onReveal}
      className={cn(
        "border border-pink-300/30 group/canvas-card flex flex-col items-center justify-center max-w-xs w-full mx-auto p-4 relative h-64 cursor-pointer rounded-2xl transition-all duration-300",
        revealed ? "ring-2 ring-pink-400/60 shadow-lg shadow-pink-500/20" : "hover:border-pink-400/50"
      )}
    >
      {/* Corner accents */}
      <PlusIcon className="absolute h-5 w-5 -top-2.5 -left-2.5 text-pink-300/60" />
      <PlusIcon className="absolute h-5 w-5 -bottom-2.5 -left-2.5 text-pink-300/60" />
      <PlusIcon className="absolute h-5 w-5 -top-2.5 -right-2.5 text-pink-300/60" />
      <PlusIcon className="absolute h-5 w-5 -bottom-2.5 -right-2.5 text-pink-300/60" />

      {/* Canvas reveal */}
      <AnimatePresence>
        {(hovered || revealed) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0 rounded-2xl overflow-hidden"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName={card.containerClassName}
              colors={card.colors}
              dotSize={2}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-20 text-center px-2">
        <div
          className={cn(
            "mb-3 transition-all duration-300",
            hovered || revealed
              ? "-translate-y-2 opacity-80"
              : "translate-y-0"
          )}
        >
          {card.icon}
        </div>
        <p
          className={cn(
            "text-lg font-bold transition-all duration-300",
            hovered || revealed
              ? "text-white opacity-100 -translate-y-1"
              : "text-white/70 opacity-60"
          )}
        >
          {card.title}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-pink-200 mt-2 leading-relaxed"
        >
          {card.subtitle}
        </motion.p>
      </div>

      {!revealed && (
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-3 text-xs text-pink-300/60 z-20"
        >
          tap to unlock ✨
        </motion.p>
      )}
    </div>
  );
};
