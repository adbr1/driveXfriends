"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { brand, hero, manifesto } from "@/lib/content";
import { MagneticButton } from "@/components/primitives/magnetic-button";
import { MotionText } from "@/components/primitives/motion-text";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const HeroCanvas = dynamic(() => import("@/components/scenes/hero-canvas"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,167,255,0.08), transparent 70%)",
      }}
    />
  ),
});

const SESSION_KEY = "dxf-prologue-played";
const INTRO_COMPLETE_EVENT = "dxf:intro-complete";
const INTRO_HOLD = 3400;

const DRIVE = "Drive".split("");
const FRIENDS = "Friends".split("");
const LETTER_DELAY = 0.04;
const LETTER_START = 1.7; // timing of letter rain start (after flash)

export function ChapterPrologue() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"intro" | "settled">("intro");

  useEffect(() => {
    const played = sessionStorage.getItem(SESSION_KEY);
    if (played || reduced) {
      setPhase("settled");
      sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, [reduced]);

  useEffect(() => {
    if (phase !== "intro") return;
    document.body.classList.add("no-scroll");
    const t = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("settled");
    }, INTRO_HOLD);
    return () => window.clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "settled") return;
    document.body.classList.remove("no-scroll");
    window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
  }, [phase]);

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const canvasScrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);

  const intro = phase === "intro";

  return (
    <section id="prologue" ref={ref} aria-labelledby="prologue-title" className="relative">
      <div className="relative h-[100svh] min-h-[560px] w-full overflow-hidden sm:min-h-[680px]">
        {/* 3D Canvas */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro ? 0 : 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale: canvasScale }}
        >
          <motion.div className="absolute inset-0" style={{ opacity: canvasScrollOpacity }}>
            <HeroCanvas />
          </motion.div>
        </motion.div>

        {/* Camera shake wrapper for intro-only */}
        <motion.div
          className="absolute inset-0 z-[3]"
          animate={
            intro
              ? { x: [0, -3, 2, -2, 1, 0], y: [0, 2, -2, 1, -1, 0] }
              : { x: 0, y: 0 }
          }
          transition={{ duration: 0.55, delay: 1.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
        >
          {/* Radial perspective burst — only intro */}
          <AnimatePresence>
            {intro ? (
              <motion.div
                key="radial"
                aria-hidden
                className="absolute inset-0"
                exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
              >
                <RadialBurst />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Speed streaks */}
          <AnimatePresence>
            {intro ? (
              <motion.div
                key="streaks"
                aria-hidden
                className="absolute inset-0"
                exit={{ opacity: 0, transition: { duration: 0.4 } }}
              >
                <SpeedStreaks />
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* White flash */}
          <AnimatePresence>
            {intro ? (
              <motion.div
                key="flash"
                aria-hidden
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.55, 0.15, 0] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.9,
                  times: [0, 0.78, 0.86, 0.92, 1],
                  ease: "easeOut",
                }}
              />
            ) : null}
          </AnimatePresence>

          {/* Center horizontal hairline that emerges with the title and lingers */}
          <AnimatePresence>
            {intro ? (
              <motion.div
                key="centerline"
                aria-hidden
                className="absolute left-0 right-0 h-[1px] origin-center"
                style={{
                  top: "calc(50% + 7vh)",
                  background:
                    "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.85) 50%, transparent)",
                  filter: "blur(0.4px)",
                  boxShadow: "0 0 28px rgba(var(--rgb-fg),0.5)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
                transition={{
                  scaleX: { delay: LETTER_START - 0.05, duration: 1.0, ease: [0.16, 1, 0.3, 1] },
                  opacity: { delay: LETTER_START - 0.05, duration: 0.4 },
                }}
              />
            ) : null}
          </AnimatePresence>
        </motion.div>

        {/* Veils — only after settle */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          animate={{ opacity: intro ? 0 : 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--rgb-bg),0.4) 0%, rgba(var(--rgb-bg),0) 30%, rgba(var(--rgb-bg),0) 60%, rgba(var(--rgb-bg),0.9) 100%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 z-[2] tech-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro ? 0 : 0.5 }}
          transition={{ duration: 1.4 }}
        />

        {/* Coords — only intro */}
        <AnimatePresence>
          {intro ? (
            <motion.div
              key="coords"
              className="absolute bottom-[14vh] left-1/2 z-[5] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver-dim)] tabular"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.5 } }}
              transition={{ delay: reduced ? 0 : 2.8, duration: 0.7 }}
            >
              {brand.origin.lat} · {brand.origin.lon} · {brand.origin.label}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Layout-morph container */}
        <div
          className={cn(
            "absolute inset-0 z-[5] mx-auto flex max-w-[1440px] flex-col px-[var(--gutter)] transition-[justify-content,align-items,padding] duration-[1400ms]",
            intro
              ? "items-center justify-center"
              : "items-start justify-end pt-[96px] pb-[clamp(2rem,7vh,7rem)] sm:pt-[120px]",
          )}
        >
          {/* Badge */}
          <motion.div
            layout
            className={cn(
              "mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[var(--color-silver)] backdrop-blur",
              !intro && "self-start",
            )}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduced ? 0 : 2.6,
              duration: 0.6,
              layout: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            }}
          >
            <span className="led-live h-[5px] w-[5px] rounded-full bg-[var(--color-signal)]" />
            Luxembourg Automotive Club · Saison 2026
          </motion.div>

          {/* Title — letters rain in */}
          <motion.h1
            id="prologue-title"
            layout
            transition={{ layout: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }}
            className="font-sans font-medium leading-[1.0] tracking-[-0.04em]"
            style={{
              fontSize: intro
                ? "clamp(2.4rem, 13vw, 7rem)"
                : "clamp(3rem, 18vw, 11rem)",
              textAlign: intro ? "center" : "left",
            }}
          >
            <span className="sr-only">{brand.name}</span>

            <span aria-hidden className="block">
              {DRIVE.map((c, i) => (
                <RainLetter key={`d-${i}`} char={c} index={i} reduced={reduced} />
              ))}
            </span>

            <span aria-hidden className="block">
              <RainLetter
                char="×"
                index={DRIVE.length}
                reduced={reduced}
                small
                silver
              />
              <span className="inline-block" style={{ width: "0.18em" }} />
              {FRIENDS.map((c, i) => (
                <RainLetter
                  key={`f-${i}`}
                  char={c}
                  index={DRIVE.length + 1 + i}
                  reduced={reduced}
                />
              ))}
            </span>
          </motion.h1>

          {/* Subtitle + CTAs */}
          <AnimatePresence>
            {!intro ? (
              <motion.div
                key="hero-extras"
                className="mt-8 flex w-full flex-col gap-6 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-8"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="max-w-md">
                  <p className="text-[15px] leading-[1.6] text-[var(--color-bone)] sm:text-[17px]">{hero.subtitle}</p>
                  <p className="mt-3 text-[13px] leading-[1.6] text-[var(--color-silver-dim)] sm:text-[14px]">
                    {hero.shortLine}
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
                  <MagneticButton href={hero.ctaPrimary.href} variant="primary">
                    {hero.ctaPrimary.label}
                  </MagneticButton>
                  <MagneticButton href={hero.ctaSecondary.href} variant="ghost">
                    {hero.ctaSecondary.label}
                  </MagneticButton>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {!intro ? (
            <motion.div
              aria-hidden
              key="scroll-mark"
              className="absolute bottom-6 left-1/2 z-[5] -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <motion.span
                className="block h-8 w-[1px] origin-top bg-[rgba(var(--rgb-fg),0.4)]"
                animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Hero parallax wrapper for scroll effect (post-settle) */}
        <motion.div
          className="absolute inset-0 z-[6] pointer-events-none"
          style={{ opacity: heroOpacity, y: heroY }}
        />
      </div>

      {/* MANIFESTE */}
      <div className="relative z-[5] py-[clamp(4.5rem,14vh,12rem)]">
        <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12">
            <div className="col-span-12 md:col-span-3">
              <div className="sticky top-[110px] flex flex-col gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.05)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver)]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                  {manifesto.eyebrow}
                </span>
              </div>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2
                id="manifesto-title"
                className="text-grad font-sans font-medium leading-[0.95] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.25rem, 10vw, 5.5rem)" }}
              >
                <SplitTitle text={manifesto.title} />
              </h2>
              <div className="mt-8 max-w-[58ch] text-[clamp(1rem,1.6vw,1.5rem)] leading-[1.6] sm:mt-12">
                <MotionText
                  text={manifesto.body}
                  highlights={manifesto.highlights}
                  stagger={0.012}
                  duration={0.65}
                />
              </div>
              <div className="mt-10 flex flex-wrap gap-2 sm:mt-16">
                {manifesto.highlights.map((w, i) => (
                  <motion.span
                    key={w}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                    transition={{ delay: i * 0.04, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-full bg-[rgba(var(--rgb-fg),0.05)] px-3.5 py-1.5 text-[12px] tracking-[0.04em] text-[var(--color-silver)]"
                  >
                    {w}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RainLetter({
  char,
  index,
  reduced,
  small,
  silver,
}: {
  char: string;
  index: number;
  reduced: boolean;
  small?: boolean;
  silver?: boolean;
}) {
  return (
    <motion.span
      className="inline-block"
      style={{
        fontSize: small ? "0.78em" : undefined,
        ...(silver
          ? { color: "var(--color-silver)" }
          : {
              backgroundImage:
                "linear-gradient(180deg, rgba(var(--rgb-fg),1) 0%, rgba(var(--rgb-fg),0.95) 40%, rgba(var(--rgb-fg),0.55) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }),
      }}
      initial={{
        y: -140,
        opacity: 0,
        filter: "blur(14px)",
        rotate: index % 2 === 0 ? -7 : 7,
        scale: 1.18,
      }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotate: 0, scale: 1 }}
      transition={{
        delay: reduced ? 0 : LETTER_START + index * LETTER_DELAY,
        type: "spring",
        stiffness: 220,
        damping: 14,
        mass: 0.85,
      }}
    >
      {char}
    </motion.span>
  );
}

function RadialBurst() {
  const lines = Array.from({ length: 16 }, (_, i) => i);
  return (
    <div className="absolute left-1/2 top-1/2 h-0 w-0">
      {lines.map((i) => {
        const angle = (i / 16) * 360;
        return (
          <motion.div
            key={i}
            className="absolute h-[1px]"
            style={{
              top: 0,
              left: 0,
              width: "85vmax",
              transform: `rotate(${angle}deg)`,
              transformOrigin: "left center",
              background:
                "linear-gradient(90deg, rgba(var(--rgb-fg),0.85) 0%, rgba(var(--rgb-fg),0.3) 22%, transparent 55%)",
              filter: "blur(0.4px)",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: [0, 1.05, 1, 1], opacity: [0, 0.85, 0.5, 0] }}
            transition={{
              duration: 1.95,
              delay: i * 0.022,
              times: [0, 0.35, 0.65, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        );
      })}
      <motion.div
        className="absolute h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "rgba(var(--rgb-fg),1)",
          boxShadow: "0 0 28px 4px rgba(var(--rgb-fg),0.85)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1.6, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, times: [0, 0.18, 0.45, 1], ease: "easeOut" }}
      />
    </div>
  );
}

function SpeedStreaks() {
  const streaks = [
    { top: "30%", delay: 0.55, duration: 0.55 },
    { top: "58%", delay: 0.7,  duration: 0.55 },
    { top: "44%", delay: 0.85, duration: 0.5 },
    { top: "72%", delay: 1.0,  duration: 0.5 },
    { top: "24%", delay: 1.15, duration: 0.45 },
    { top: "52%", delay: 1.3,  duration: 0.4 },
    { top: "66%", delay: 1.45, duration: 0.35 },
  ];
  return (
    <>
      {streaks.map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px]"
          style={{
            top: s.top,
            left: "-30%",
            right: "-30%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(var(--rgb-fg),0.95) 50%, transparent 100%)",
            boxShadow: "0 0 22px rgba(var(--rgb-fg),0.7)",
            filter: "blur(0.5px)",
          }}
          initial={{ x: "-110%", scaleX: 0.4 }}
          animate={{ x: "110%", scaleX: [0.4, 1.7, 0.4] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            ease: [0.16, 1, 0.3, 1],
            scaleX: { duration: s.duration, times: [0, 0.5, 1] },
          }}
        />
      ))}
    </>
  );
}

function SplitTitle({ text }: { text: string }) {
  const lines = text.split(". ").map((l, i, arr) => l + (i < arr.length - 1 ? "." : ""));
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "100%", filter: "blur(8px)" }}
            whileInView={{ y: "0%", filter: "blur(0px)" }}
            viewport={{ once: true, margin: "0px 0px -18% 0px" }}
            transition={{ delay: i * 0.1, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}
