"use client";

import { motion } from "motion/react";
import { gallery } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";

const LAYOUT = [
  { col: "md:col-span-7", aspect: "aspect-[4/5] md:aspect-[4/5]" },
  { col: "md:col-span-5", aspect: "aspect-[4/5] sm:aspect-video md:aspect-[16/10]" },
  { col: "md:col-span-5", aspect: "aspect-[4/5] sm:aspect-square md:aspect-square" },
  { col: "md:col-span-7", aspect: "aspect-[4/5] md:aspect-[16/10]" },
  { col: "md:col-span-12", aspect: "aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9]" },
  { col: "md:col-span-6", aspect: "aspect-[4/5] md:aspect-[4/5]" },
] as const;

const GRADIENTS = [
  "radial-gradient(ellipse at 30% 20%, #1a2236 0%, #060608 65%)",
  "radial-gradient(ellipse at 80% 60%, #2a1f1a 0%, #060608 70%)",
  "radial-gradient(ellipse at 50% 80%, #142220 0%, #060608 65%)",
  "radial-gradient(ellipse at 20% 70%, #1d1a26 0%, #060608 70%)",
  "linear-gradient(115deg, #0a0e1a 0%, #060608 60%, #161a26 100%)",
  "radial-gradient(ellipse at 60% 30%, #161b24 0%, #060608 70%)",
] as const;

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
] as const;

export function ChapterMoments() {
  return (
    <section id="moments" aria-labelledby="moments-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <ChapterCard roman="IV" title="Moments" timecode="00:46:21" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16 md:gap-y-10">
          <div className="col-span-12 md:col-span-7">
            <h2
              id="moments-title"
              className="text-grad font-sans font-medium leading-[0.96] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.25rem, 10vw, 5rem)" }}
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  Une memoire
                </motion.span>
              </span>
              <span className="block overflow-hidden text-[var(--color-silver-dim)]">
                <motion.span
                  className="block"
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                  transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  en longue exposition.
                </motion.span>
              </span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:pt-4">
            <p className="max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:text-[17px]">
              Chaque sortie laisse une trace. Lumieres, reflets, silhouettes - fragments de nuits qui prolongent
              l'experience bien apres le retour au garage.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-12 gap-3 pb-[clamp(6rem,14vh,10rem)] sm:mt-16 md:mt-20 md:gap-5">
          {gallery.map((g, i) => {
            const l = LAYOUT[i];
            return (
              <motion.figure
                key={g.id}
                initial={{ opacity: 0, scale: 0.96, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                transition={{ delay: 0.08 + i * 0.055, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.012 }}
                className={`group relative col-span-12 overflow-hidden rounded-[20px] border border-[rgba(var(--rgb-fg),0.06)] sm:rounded-[28px] ${l.aspect} ${l.col}`}
                style={{ background: GRADIENTS[i] }}
              >
                <img
                  src={PLACEHOLDER_IMAGES[i]}
                  alt={`Placeholder photo - ${g.label}`}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale transition duration-700 group-hover:scale-[1.04] group-hover:opacity-95 group-hover:grayscale-0"
                  loading="lazy"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(var(--rgb-bg),0.08), rgba(var(--rgb-bg),0.52)), radial-gradient(ellipse at 70% 20%, rgba(122,167,255,0.16), transparent 48%)",
                  }}
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.4) 50%, transparent)",
                  }}
                />

                <motion.div
                  aria-hidden
                  className="absolute inset-0 bg-[var(--color-ink)]"
                  initial={{ clipPath: "inset(0 0 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0 100% 0)" }}
                  viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                  transition={{ delay: 0.12 + i * 0.055, duration: 1.15, ease: [0.65, 0, 0.05, 1] }}
                />

                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'><filter id='n'><feTurbulence baseFrequency='0.7' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                  }}
                />

                <motion.div
                  aria-hidden
                  className="absolute left-[-30%] right-[-30%] top-[55%] h-[1px]"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.7), transparent)",
                    boxShadow: "0 0 24px rgba(var(--rgb-fg),0.4)",
                    filter: "blur(0.5px)",
                  }}
                  animate={{ x: ["-30%", "30%"] }}
                  transition={{
                    duration: 14 + i * 1.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-7"
                  initial={{ y: 0 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-start justify-between gap-3 text-[11px] text-[var(--color-silver-dim)]">
                    <span>{String(i + 1).padStart(2, "0")} - {gallery.length}</span>
                    <span>Image placeholder</span>
                  </div>
                  <figcaption className="flex items-end justify-between gap-4">
                    <span className="font-sans text-lg font-medium text-[var(--color-bone)] sm:text-xl md:text-2xl">
                      {g.label}
                    </span>
                    <motion.span
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--rgb-fg),0.08)] text-[var(--color-bone)] backdrop-blur"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.32 + i * 0.055, duration: 0.55 }}
                      aria-hidden
                    >
                      ↗
                    </motion.span>
                  </figcaption>
                </motion.div>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
