"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Streak = { top: string; delay: number; duration: number; opacity: number; hue: string; width: string };

const streaks: Streak[] = [
  { top: "16%", delay: 0, duration: 22, opacity: 0.25, hue: "rgba(var(--rgb-fg),0.7)", width: "55%" },
  { top: "70%", delay: 6, duration: 26, opacity: 0.18, hue: "rgba(122,167,255,0.55)", width: "60%" },
];

export function LightStreaks() {
  const reduced = usePrefersReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0"
          style={{ top: s.top, height: "1px" }}
          initial={{ x: "-30%" }}
          animate={reduced ? { x: "20%" } : { x: ["-30%", "130%"] }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: s.duration, delay: s.delay, repeat: Infinity, ease: "linear" }
          }
        >
          <div
            style={{
              height: "1px",
              filter: "blur(0.6px)",
              background: `linear-gradient(90deg, transparent 0%, ${s.hue} 50%, transparent 100%)`,
              opacity: s.opacity,
              width: s.width,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
