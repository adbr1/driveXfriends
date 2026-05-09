"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Props = {
  roman: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function Interstitial({ roman, eyebrow, title, subtitle }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // The text scales in, peaks at mid, then fades out — a "moment held"
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.55, 0.85], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.92, 1, 1.02, 1.08]);
  const eyebrowY = useTransform(scrollYProgress, [0, 0.3], [16, 0]);

  return (
    <div ref={ref} aria-hidden className="relative h-[130vh] md:h-[180vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div
          className="relative flex flex-col items-center gap-5 px-[var(--gutter)] text-center sm:gap-6"
          style={{ opacity }}
        >
          <motion.span
            className="rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver)] backdrop-blur"
            style={{ y: eyebrowY }}
          >
            Chapitre {roman} — {eyebrow}
          </motion.span>

          <motion.h2
            className="text-grad font-sans font-medium leading-[0.95] tracking-[-0.04em]"
            style={{
              fontSize: "clamp(2.7rem, 15vw, 11rem)",
              scale,
            }}
          >
            {title}
          </motion.h2>

          {subtitle ? (
            <motion.p
              className="max-w-[44ch] text-[14px] leading-[1.65] text-[var(--color-silver)] sm:text-[15px]"
              style={{ y: eyebrowY }}
            >
              {subtitle}
            </motion.p>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
