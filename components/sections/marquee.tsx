"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

const WORDS = [
  "Routes d'exception",
  "Nuits filées",
  "Rencontres choisies",
  "Cars & Coffee",
  "Asphalte vivant",
  "Lumière froide",
  "Trajectoires",
  "Communauté",
];

export function Marquee() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  const items = [...WORDS, ...WORDS];

  return (
    <div ref={ref} aria-hidden className="relative my-8 overflow-hidden py-10">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32"
        style={{ background: "linear-gradient(90deg, var(--color-ink), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32"
        style={{ background: "linear-gradient(270deg, var(--color-ink), transparent)" }}
      />

      <motion.div
        className="flex w-max items-center gap-12 whitespace-nowrap"
        style={reduced ? undefined : { x }}
      >
        {items.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-12 text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[1] tracking-[-0.025em]"
          >
            <span
              className={
                i % 2 === 0
                  ? "text-grad"
                  : "text-[var(--color-silver-dim)] [-webkit-text-stroke:1px_rgba(184,192,204,0.4)] [color:transparent]"
              }
            >
              {w}
            </span>
            <span aria-hidden className="text-[var(--color-silver-dim)] opacity-50">
              ✦
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
