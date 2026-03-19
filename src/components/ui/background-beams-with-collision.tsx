"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useState, useEffect, useCallback } from "react";

export const BackgroundBeamsWithCollision = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7 },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
    { initialX: 200, translateX: 200, duration: 8, repeatDelay: 5 },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <CollisionMechanism
          key={`beam-${idx}`}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      {children}
      <div
        ref={containerRef}
        className="absolute bottom-0 w-full inset-x-0 pointer-events-none h-px bg-transparent"
      />
    </div>
  );
};

// Pre-computed random-ish values per span index (deterministic, no Math.random in render)
const EXPLOSION_SPANS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  dx: ((i * 37 + 13) % 80) - 40,
  dy: -(((i * 23 + 7) % 50) + 10),
  dur: (((i * 17 + 5) % 15) / 10 + 0.5),
}));

const Explosion = ({ style }: { style?: React.CSSProperties }) => (
  <div className="absolute z-50 h-2 w-2 pointer-events-none" style={style}>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-linear-to-r from-transparent via-pink-500 to-transparent blur-sm"
    />
    {EXPLOSION_SPANS.map((s) => (
      <motion.span
        key={s.id}
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={{ x: s.dx, y: s.dy, opacity: 0 }}
        transition={{ duration: s.dur, ease: "easeOut" }}
        className="absolute h-1 w-1 rounded-full bg-linear-to-b from-pink-500 to-purple-500"
      />
    ))}
  </div>
);

const CollisionMechanism = ({
  parentRef,
  containerRef,
  beamOptions = {},
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  beamOptions?: {
    initialX?: number;
    translateX?: number;
    className?: string;
    duration?: number;
    delay?: number;
    repeatDelay?: number;
  };
}) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{ x: number; y: number } | null>(null);
  const [beamKey, setBeamKey] = useState(0);
  const [detecting, setDetecting] = useState(true);

  const checkCollision = useCallback(() => {
    if (!beamRef.current || !containerRef.current || !parentRef.current || !detecting) return;
    const br = beamRef.current.getBoundingClientRect();
    const cr = containerRef.current.getBoundingClientRect();
    const pr = parentRef.current.getBoundingClientRect();
    if (br.bottom >= cr.top) {
      setCollision({ x: br.left - pr.left + br.width / 2, y: br.bottom - pr.top });
      setDetecting(false);
    }
  }, [containerRef, parentRef, detecting]);

  useEffect(() => {
    const id = setInterval(checkCollision, 50);
    return () => clearInterval(id);
  }, [checkCollision]);

  useEffect(() => {
    if (!collision) return;
    const t1 = setTimeout(() => { setCollision(null); setDetecting(false); }, 2000);
    const t2 = setTimeout(() => { setBeamKey((k) => k + 1); setDetecting(true); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        initial={{ translateY: "-200px", translateX: `${beamOptions.initialX ?? 0}px` }}
        animate={{ translateY: "1800px", translateX: `${beamOptions.translateX ?? 0}px` }}
        transition={{
          duration: beamOptions.duration ?? 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay ?? 0,
          repeatDelay: beamOptions.repeatDelay ?? 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-linear-to-t from-pink-500 via-purple-500 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision && (
          <Explosion
            key={`${collision.x}-${collision.y}`}
            style={{ left: collision.x, top: collision.y, transform: "translate(-50%,-50%)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
