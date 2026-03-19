"use client";
import React, { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  const animated = useRef(false);

  useEffect(() => {
    if (!animated.current) {
      animated.current = true;
      animate(
        "span",
        { opacity: 1, filter: filter ? "blur(0px)" : "none" },
        { duration, delay: stagger(0.1) }
      );
    }
  });

  return (
    <div className={cn("font-bold", className)}>
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0 inline-block mr-1"
            style={{ filter: filter ? "blur(10px)" : "none" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
