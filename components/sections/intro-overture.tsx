"use client";

import { motion } from "motion/react";
import { useMemo } from "react";

const EASE_CINEMA = [0.16, 1, 0.3, 1] as const;

interface IntroOvertureProps {
  active: boolean;
  reduced: boolean;
  isTouch: boolean;
}

export function IntroOverture({ active, reduced, isTouch }: IntroOvertureProps) {
  if (reduced) return null;
  if (!active) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[7] overflow-hidden"
    >
      <RoadSurface />
      <RoadMarkings />
      <SpeedStreaks isTouch={isTouch} />
      <CenterGlow />
    </div>
  );
}

function RoadSurface() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, transparent 20%, rgba(20,18,16,0.7) 38%, rgba(20,18,16,0.85) 50%, rgba(20,18,16,0.7) 62%, transparent 80%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    />
  );
}

function RoadMarkings() {
  return (
    <>
      {/* Center line — thick dashes */}
      <motion.div
        className="absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2"
        style={{
          background:
            "repeating-linear-gradient(90deg, rgba(255,250,235,0.9) 0px, rgba(255,250,235,0.9) 60px, transparent 60px, transparent 140px)",
          backgroundSize: "140px 4px",
          animation: "road-scroll 1.8s cubic-bezier(0.12, 0, 0.0, 1) forwards",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.9, 0] }}
        transition={{ duration: 2.4, times: [0, 0.15, 0.75, 1], ease: "easeOut" }}
      />
      {/* Top edge line — thin */}
      <motion.div
        className="absolute left-0 h-[2px] w-full"
        style={{
          top: "35%",
          background:
            "repeating-linear-gradient(90deg, rgba(255,250,235,0.35) 0px, rgba(255,250,235,0.35) 30px, transparent 30px, transparent 150px)",
          backgroundSize: "150px 2px",
          animation: "road-scroll 1.6s cubic-bezier(0.12, 0, 0.0, 1) forwards",
          animationDelay: "0.1s",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.6, 0] }}
        transition={{ duration: 2.2, times: [0, 0.18, 0.72, 1], ease: "easeOut" }}
      />
      {/* Bottom edge line — thin */}
      <motion.div
        className="absolute left-0 h-[2px] w-full"
        style={{
          top: "65%",
          background:
            "repeating-linear-gradient(90deg, rgba(255,250,235,0.35) 0px, rgba(255,250,235,0.35) 30px, transparent 30px, transparent 150px)",
          backgroundSize: "150px 2px",
          animation: "road-scroll 1.6s cubic-bezier(0.12, 0, 0.0, 1) forwards",
          animationDelay: "0.15s",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.6, 0] }}
        transition={{ duration: 2.2, times: [0, 0.18, 0.72, 1], ease: "easeOut" }}
      />
    </>
  );
}

function SpeedStreaks({ isTouch }: { isTouch: boolean }) {
  const count = isTouch ? 8 : 16;

  const streaks = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r1 = (seed % 1000) / 1000;
        const r2 = ((seed * 7) % 1000) / 1000;
        const r3 = ((seed * 13) % 1000) / 1000;
        const r4 = ((seed * 17) % 1000) / 1000;
        return {
          top: `${15 + r1 * 70}%`,
          width: 50 + r2 * 150,
          opacity: 0.15 + r3 * 0.25,
          delay: 0.3 + r4 * 0.8,
          duration: 0.6 + r2 * 0.8,
        };
      }),
    [count],
  );

  return (
    <>
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute left-0 h-[1.5px]"
          style={{
            top: s.top,
            width: s.width,
            background: `linear-gradient(90deg, transparent, rgba(255,250,235,${s.opacity}), transparent)`,
            filter: "blur(0.5px)",
          }}
          initial={{ x: "-20vw", opacity: 0 }}
          animate={{ x: "110vw", opacity: [0, 1, 1, 0] }}
          transition={{
            x: { delay: s.delay, duration: s.duration, ease: EASE_CINEMA },
            opacity: {
              delay: s.delay,
              duration: s.duration,
              times: [0, 0.1, 0.7, 1],
              ease: "easeOut",
            },
          }}
        />
      ))}
    </>
  );
}

function CenterGlow() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background:
          "radial-gradient(ellipse 60% 45% at 50% 50%, rgba(122,167,255,0.35) 0%, rgba(122,167,255,0.12) 35%, transparent 65%)",
        filter: "blur(20px)",
      }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: [0, 0.7, 0.5, 0], scale: [0.4, 1.0, 1.15, 1.3] }}
      transition={{
        duration: 2.0,
        delay: 0.8,
        times: [0, 0.4, 0.7, 1],
        ease: "easeOut",
      }}
    />
  );
}
