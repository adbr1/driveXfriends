"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

type Moment = (typeof gallery)[number];

export function ChapterMoments() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const activeMoment = activeIndex === null ? null : gallery[activeIndex];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!activeMoment) return;
    document.body.classList.add("no-scroll");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((value) => nextIndex(value ?? 0));
      if (event.key === "ArrowLeft") setActiveIndex((value) => prevIndex(value ?? 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [activeMoment]);

  return (
    <>
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
                Une memoire <span className="text-[var(--color-silver-dim)]">en longue exposition.</span>
              </RevealTitle>
            </div>
            <SequenceItem className="col-span-12 md:col-span-5 md:pt-4">
              <p className="max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:text-[17px]">
                Chaque sortie laisse une trace. Ouvrez un moment comme une fenetre, avec son histoire et ses images.
              </p>
            </SequenceItem>
          </div>

          <SequenceItem className="mt-12 pb-[clamp(6rem,14vh,10rem)] sm:mt-16 md:mt-20">
            <div className="no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-3 md:mx-0 md:grid md:snap-none md:grid-cols-12 md:gap-4 md:overflow-visible md:px-0 lg:gap-5">
              {gallery.map((g, i) => {
                const wide = i === 0 || i === 5;
                return (
                  <motion.button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    whileHover={{ scale: 1.012 }}
                    className={`group relative aspect-[4/5] min-w-[78vw] snap-center overflow-hidden rounded-[20px] border border-[rgba(var(--rgb-fg),0.06)] text-left sm:min-w-[52vw] sm:rounded-[24px] md:min-w-0 md:aspect-auto md:h-[360px] lg:h-[400px] ${
                      wide ? "md:col-span-6" : "md:col-span-3"
                    }`}
                    style={{ background: GRADIENTS[i] }}
                  >
                    <img
                      src={g.image.src}
                      alt={g.image.alt}
                      className="moment-image absolute inset-0 h-full w-full object-cover opacity-80 grayscale transition duration-700 group-hover:scale-[1.04] group-hover:opacity-95 group-hover:grayscale-0"
                      loading="lazy"
                      decoding="async"
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
                      className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 md:p-7"
                      initial={{ y: 0 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="flex items-start justify-between gap-3 text-[11px] text-[var(--color-silver-dim)]">
                        <span>
                          {String(i + 1).padStart(2, "0")} - {gallery.length}
                        </span>
                        <span>{g.location}</span>
                      </div>
                      <span className="flex items-end justify-between gap-4">
                        <span className="font-sans text-lg font-medium text-[var(--color-bone)] sm:text-xl md:text-2xl">
                          {g.label}
                        </span>
                        <span
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--rgb-fg),0.08)] text-[var(--color-bone)] backdrop-blur"
                          aria-hidden
                        >
                          ↗
                        </span>
                      </span>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </SequenceItem>
        </SectionSequence>
      </div>

    </section>
    {mounted
      ? createPortal(
          <AnimatePresence>
            {activeMoment ? (
              <MomentWindow
                moment={activeMoment}
                index={activeIndex ?? 0}
                onClose={() => setActiveIndex(null)}
                onNext={() => setActiveIndex((value) => nextIndex(value ?? 0))}
                onPrev={() => setActiveIndex((value) => prevIndex(value ?? 0))}
              />
            ) : null}
          </AnimatePresence>,
          document.body,
        )
      : null}
    </>
  );
}

function nextIndex(index: number) {
  return (index + 1) % gallery.length;
}

function prevIndex(index: number) {
  return (index - 1 + gallery.length) % gallery.length;
}

function MomentWindow({
  moment,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  moment: Moment;
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
  const navBtn =
    "press inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(var(--rgb-fg),0.14)] bg-[rgba(var(--rgb-fg),0.04)] text-[16px] text-[var(--color-bone)] transition-colors hover:bg-[rgba(var(--rgb-fg),0.1)]";

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(var(--rgb-bg),0.78)] px-3 pb-3 pt-[6.5rem] backdrop-blur-xl sm:px-6 sm:pb-6 sm:pt-[7.5rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      role="dialog"
      aria-modal="true"
      aria-label={moment.label}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[1280px] max-h-[calc(100svh-8rem)] flex-col overflow-hidden rounded-[24px] border border-[rgba(var(--rgb-fg),0.14)] bg-[rgba(var(--rgb-bg),0.86)] shadow-[0_40px_140px_-60px_rgba(0,0,0,0.95)] sm:max-h-[calc(100svh-9.5rem)] sm:rounded-[32px]"
        initial={{ y: 34, scale: 0.985, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 18, scale: 0.99, opacity: 0 }}
        transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── header ── */}
        <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-bg),0.6)] px-4 backdrop-blur-xl sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
            <span className="tabular text-[var(--color-bone)]">{counter}</span>
            <span aria-hidden className="hidden text-[var(--color-silver-dim)] sm:inline">·</span>
            <span className="hidden truncate sm:inline">{moment.location}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={onPrev} className={navBtn} aria-label="Moment précédent">
              ←
            </button>
            <button type="button" onClick={onNext} className={navBtn} aria-label="Moment suivant">
              →
            </button>
            <span aria-hidden className="mx-1 h-5 w-px bg-[rgba(var(--rgb-fg),0.12)]" />
            <button type="button" onClick={onClose} className={navBtn} aria-label="Fermer">
              ×
            </button>
          </div>
        </div>

        {/* ── scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            {/* ── hero image ── */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(var(--rgb-fg),0.035)] lg:sticky lg:top-0 lg:aspect-auto lg:h-[calc(100svh-13.5rem)] lg:max-h-[calc(100svh-13.5rem)] lg:self-start">
              <img
                src={moment.image.src}
                alt={moment.image.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(var(--rgb-bg),0.08), rgba(var(--rgb-bg),0.55)), radial-gradient(ellipse at 70% 20%, rgba(122,167,255,0.18), transparent 50%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="max-w-[10ch] text-5xl font-black uppercase leading-[0.84] text-[var(--color-bone)] sm:text-6xl lg:text-7xl">
                  {moment.label}
                </h3>
              </div>
            </div>

            {/* ── right panel ── */}
            <div className="flex flex-col gap-8 p-6 sm:p-9 lg:p-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                  {moment.date} · {moment.location}
                </p>
                <p className="mt-5 max-w-[48ch] text-[16px] leading-[1.7] text-[var(--color-silver)] sm:text-[17px]">
                  {moment.description}
                </p>
              </div>

              {moment.photos.length > 0 ? (
                <div>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                    Galerie · {moment.photos.length}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {moment.photos.map((photo, photoIndex) => (
                      <motion.figure
                        key={photo}
                        className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-[rgba(var(--rgb-fg),0.06)] bg-[rgba(var(--rgb-fg),0.04)]"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 * photoIndex, duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <img
                          src={photo}
                          alt={`${moment.label} ${photoIndex + 1}`}
                          className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.04] group-hover:grayscale-0"
                          loading="lazy"
                          decoding="async"
                        />
                      </motion.figure>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* ── footer nav ── */}
              <div className="mt-auto flex items-center justify-between border-t border-[rgba(var(--rgb-fg),0.08)] pt-5 text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                <span className="tabular text-[var(--color-bone)]">{counter}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={onPrev} className={navBtn} aria-label="Moment précédent">
                    ←
                  </button>
                  <button type="button" onClick={onNext} className={navBtn} aria-label="Moment suivant">
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
