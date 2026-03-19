"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

// ─── Hero Highlight ──────────────────────────────────────────────────────────

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-full flex items-center justify-center",
        containerClassName
      )}
    >
      {/* dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "relative inline-block px-1 py-0.5 rounded-md",
        "bg-linear-to-r from-pink-500/40 via-purple-500/40 to-rose-500/40",
        "text-white font-bold",
        "[box-shadow:inset_0_0_20px_rgba(236,72,153,0.2)]",
        className
      )}
    >
      <span
        className="absolute inset-0 rounded-md"
        style={{
          background:
            "linear-gradient(90deg, rgba(236,72,153,0.25), rgba(168,85,247,0.25), rgba(244,63,94,0.25))",
        }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
};

// ─── Globe ───────────────────────────────────────────────────────────────────

interface GlobeConfig {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
  order?: number;
}

export const World = ({
  data,
  globeConfig,
}: {
  data: GlobeArc[];
  globeConfig: GlobeConfig;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;
    let rafId = 0;
    let globe: { update: (s: Partial<Record<string, unknown>>) => void; destroy: () => void } | null = null;

    import("cobe").then(({ default: createGlobe }) => {
      globe = createGlobe(canvasRef.current!, {
        devicePixelRatio: 2,
        width: 600 * 2,
        height: 600 * 2,
        phi: 0,
        theta: 0.3,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.1, 0.1, 0.35] as [number, number, number],
        markerColor: [1, 0.4, 0.6] as [number, number, number],
        glowColor: [0.5, 0.3, 0.8] as [number, number, number],
        markers: data.slice(0, 5).map((arc) => ({
          location: [arc.startLat, arc.startLng] as [number, number],
          size: 0.05,
        })),
      });

      const rotate = () => {
        if (globeConfig.autoRotate) {
          phi += (globeConfig.autoRotateSpeed ?? 0.5) * 0.005;
          globe?.update({ phi });
        }
        rafId = requestAnimationFrame(rotate);
      };
      rafId = requestAnimationFrame(rotate);
    });

    return () => {
      cancelAnimationFrame(rafId);
      globe?.destroy();
    };
  }, [data, globeConfig]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: "1" }}
    />
  );
};
