"use client";

import { motion } from "motion/react";
import { gallery } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";

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
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="IV" title="Moments" timecode="00:46:21" />
          </SequenceItem>

          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16 md:gap-y-10">
            <div className="col-span-12 md:col-span-7">
              <RevealTitle
                id="moments-title"
                className="text-grad font-sans font-medium leading-[0.96] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.25rem, 10vw, 5rem)" }}
              >
                Une mémoire <span className="text-[var(--color-silver-dim)]">en longue exposition.</span>
              </RevealTitle>
            </div>
            <SequenceItem className="col-span-12 md:col-span-5 md:pt-4">
              <p className="max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:text-[17px]">
                Chaque sortie laisse une trace. Lumières, reflets, silhouettes - fragments de nuits qui prolongent
                l'expérience bien après le retour au garage.
              </p>
            </SequenceItem>
          </div>

          <SequenceItem className="mt-12 pb-[clamp(6rem,14vh,10rem)] sm:mt-16 md:mt-20">
            <div className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-3 md:mx-0 md:grid md:snap-none md:grid-cols-12 md:gap-4 md:overflow-visible md:px-0 lg:gap-5">
            {gallery.map((g, i) => {
              return (
                <motion.figure
                  key={g.id}
                  whileHover={{ scale: 1.012 }}
                  className={`group relative aspect-[4/5] min-w-[78vw] snap-center overflow-hidden rounded-[20px] border border-[rgba(var(--rgb-fg),0.06)] sm:min-w-[52vw] sm:rounded-[24px] md:min-w-0 ${
                    i === 0 || i === 5
                      ? "md:col-span-6 md:aspect-[16/10]"
                      : "md:col-span-3 md:aspect-[4/5]"
                  }`}
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
                  <motion.div
                    aria-hidden
                    className="absolute left-[-30%] right-[-30%] top-[55%] h-[1px]"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.7), transparent)",
                      boxShadow: "0 0 24px rgba(var(--rgb-fg),0.4)",
                      filter: "blur(0.5px)",
                    }}
                    animate={{ x: ["-30%", "30%"] }}
                    transition={{ duration: 14 + i * 1.6, repeat: Infinity, ease: "linear" }}
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
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--rgb-fg),0.08)] text-[var(--color-bone)] backdrop-blur"
                        aria-hidden
                      >
                        ↗
                      </span>
                    </figcaption>
                  </motion.div>
                </motion.figure>
              );
            })}
            </div>
          </SequenceItem>
        </SectionSequence>
      </div>
    </section>
  );
}
