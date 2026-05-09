"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  roman: string;
  title: string;
  timecode: string;
  className?: string;
};

export function ChapterCard({ roman, title, className }: Props) {
  return (
    <div className={cn("relative w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-baseline gap-4 text-[var(--color-silver-dim)]"
      >
        <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-silver)]">
          Chapitre {roman}
        </span>
        <span aria-hidden className="hairline max-w-[64px] flex-1 self-center" />
        <span className="text-[11px] font-medium tracking-[0.04em] text-[var(--color-bone)]">
          {title}
        </span>
      </motion.div>
    </div>
  );
}
