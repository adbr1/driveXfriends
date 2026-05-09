"use client";

import { motion } from "motion/react";
import { coda } from "@/lib/content";

export function Coda() {
  return (
    <section
      aria-label="Coda"
      className="relative flex min-h-[80svh] items-center justify-center overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="absolute left-0 right-0 top-1/2 h-[1px]"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transformOrigin: "left",
          background: "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.55), transparent)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-grad relative px-6 text-center font-sans font-medium leading-[1] tracking-[-0.04em]"
        style={{ fontSize: "clamp(3rem, 11vw, 11rem)" }}
      >
        {coda.line}
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-[rgba(var(--rgb-fg),0.04)] px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver-dim)] backdrop-blur"
      >
        Fin du chapitre
      </motion.span>
    </section>
  );
}
