import React from "react";

interface LukaIconProps {
  /** Diameter in px (default 28) */
  size?: number;
  /** true = faster pulse (AI generating), false = gentle idle glow */
  animated?: boolean;
  /** When true, renders just the SVG stars with no wrapper div — for use inside already-styled containers */
  bare?: boolean;
  className?: string;
}

const K = 0.7071; // sin/cos 45°

function starPath(cx: number, cy: number, R: number, r: number): string {
  return [
    `M ${cx},${cy - R}`,
    `L ${cx + r * K},${cy - r * K}`,
    `L ${cx + R},${cy}`,
    `L ${cx + r * K},${cy + r * K}`,
    `L ${cx},${cy + R}`,
    `L ${cx - r * K},${cy + r * K}`,
    `L ${cx - R},${cy}`,
    `L ${cx - r * K},${cy - r * K}`,
    "Z",
  ].join(" ");
}

export function LukaIcon({ size = 28, animated = false, bare = false, className = "" }: LukaIconProps) {
  const svgSize = bare ? size : size * 0.78;
  const dur = animated ? "1.3s" : "2.6s";

  const stars = (
    <svg
      viewBox="0 0 20 20"
      width={svgSize}
      height={svgSize}
      fill="white"
      aria-hidden="true"
    >
      {/* Large star — lower-right */}
      <path
        d={starPath(13, 12, 5.5, 1.4)}
        style={{
          transformOrigin: "13px 12px",
          animation: `luka-sparkle-${animated ? "active" : "idle"} ${dur} ease-in-out infinite`,
          animationDelay: "0s",
          filter: animated
            ? "drop-shadow(0 0 4px rgba(255,255,255,1)) drop-shadow(0 0 2px rgba(255,255,255,.9))"
            : "drop-shadow(0 0 2px rgba(255,255,255,.8))",
        }}
      />
      {/* Medium star — upper-left */}
      <path
        d={starPath(5.5, 5.5, 3.4, 0.85)}
        style={{
          transformOrigin: "5.5px 5.5px",
          animation: `luka-sparkle-${animated ? "active" : "idle"} ${dur} ease-in-out infinite`,
          animationDelay: `calc(${dur} * 0.38)`,
          filter: animated
            ? "drop-shadow(0 0 3px rgba(255,255,255,.95))"
            : "drop-shadow(0 0 1.5px rgba(255,255,255,.7))",
        }}
      />
      {/* Small star — lower-left */}
      <path
        d={starPath(5, 15.5, 1.9, 0.48)}
        style={{
          transformOrigin: "5px 15.5px",
          animation: `luka-sparkle-${animated ? "active" : "idle"} ${dur} ease-in-out infinite`,
          animationDelay: `calc(${dur} * 0.70)`,
          filter: animated
            ? "drop-shadow(0 0 2px rgba(255,255,255,.85))"
            : "drop-shadow(0 0 1px rgba(255,255,255,.5))",
        }}
      />
    </svg>
  );

  if (bare) return stars;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #8649F1 0%, #2355A4 100%)",
      }}
    >
      {stars}
    </div>
  );
}
