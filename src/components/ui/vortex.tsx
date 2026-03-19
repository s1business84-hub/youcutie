"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

// pre-built particle data (React Compiler compliant — no Math.random in render)
function seededRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 700;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  x: seededRand(i * 7) * 2 - 1,
  y: seededRand(i * 7 + 1) * 2 - 1,
  color: `hsl(${Math.floor(seededRand(i * 7 + 2) * 60 + 280)}, 100%, ${50 + seededRand(i * 7 + 3) * 30}%)`,
  radius: 0.5 + seededRand(i * 7 + 4) * 1.5,
  speed: 0.3 + seededRand(i * 7 + 5) * 0.8,
  alpha: 0.4 + seededRand(i * 7 + 6) * 0.6,
  angle: seededRand(i * 7 + 7) * Math.PI * 2,
}));

export const Vortex = ({
  children,
  className,
  containerClassName,
  backgroundColor = "black",
}: VortexProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += 0.003;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = `rgba(0,0,0,0.12)`;
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = PARTICLES[i];
        const angle = p.angle + t * p.speed;
        const r = (0.1 + seededRand(i + Math.floor(t * 0.2)) * 0.5) * Math.min(w, h) * 0.45;

        const x = cx + Math.cos(angle) * r * p.x + Math.sin(t * 0.5 + i * 0.1) * 30 * p.y;
        const y = cy + Math.sin(angle) * r * p.y + Math.cos(t * 0.4 + i * 0.1) * 30 * p.x;

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.5 + 0.5 * Math.sin(t * 2 + i));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden", containerClassName)}
      style={{ backgroundColor }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className={cn("relative z-10 w-full h-full", className)}>
        {children}
      </div>
    </div>
  );
};
