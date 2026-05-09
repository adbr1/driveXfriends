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
const INTRO_EXIT_AT = 3300;
const INTRO_EXIT_DURATION = 1250;

const INTRO_LINE_1 = "DRIVE X".split("");
const INTRO_LINE_2 = "FRIENDS".split("");
const LETTER_DELAY = 0.035;
const LETTER_START = 1.55; // timing of letter rain start (after flash)

export function ChapterPrologue() {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"intro" | "exiting" | "settled">(() => {
    if (typeof window === "undefined") return "intro";
    return sessionStorage.getItem(SESSION_KEY) ? "settled" : "intro";
  });

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
    const exitTimer = window.setTimeout(() => {
      setPhase("exiting");
    }, INTRO_EXIT_AT);
    return () => window.clearTimeout(exitTimer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exiting") return;
    const settleTimer = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPhase("settled");
    }, INTRO_EXIT_DURATION);
    return () => window.clearTimeout(settleTimer);
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
  const manifestoLineY = useTransform(scrollYProgress, [0.52, 1], [70, -70]);
  const manifestoGlow = useTransform(scrollYProgress, [0.48, 0.72, 1], [0.18, 0.72, 0.28]);

  const intro = phase !== "settled";
  const exiting = phase === "exiting";

  return (
    <section id="prologue" ref={ref} aria-labelledby="prologue-title" className="relative">
      <div
        className="relative h-[100svh] min-h-[560px] w-full overflow-hidden sm:min-h-[680px]"
        style={{ position: "relative", height: "100svh", minHeight: "560px", overflow: "hidden" }}
      >
        <motion.div
          aria-hidden
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro ? 0 : 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-[rgba(var(--rgb-bg),1)]" />
          <div
            className="hero-background-placeholder absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, rgba(122,167,255,0.12), transparent 32%), radial-gradient(ellipse at 72% 28%, rgba(var(--rgb-fg),0.1), transparent 36%), linear-gradient(180deg, rgba(var(--rgb-bg),0.06), rgba(var(--rgb-bg),0.82)), url(\"data:image/svg+xml,%3Csvg width='1400' height='900' viewBox='0 0 1400 900' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1400' height='900' fill='%23050505'/%3E%3Cg opacity='0.26' stroke='%23f4f1ea' stroke-width='1' fill='none'%3E%3Cpath d='M-80 690 C220 520 420 540 650 360 C900 160 1110 160 1500 40'/%3E%3Cpath d='M-120 760 C250 620 460 650 720 470 C960 305 1110 285 1500 210' opacity='0.55'/%3E%3Cpath d='M-120 340 C200 280 430 315 690 250 C940 190 1110 125 1500 130' opacity='0.32'/%3E%3C/g%3E%3Cg opacity='0.12' stroke='%237aa7ff' stroke-width='8' fill='none'%3E%3Cpath d='M-100 705 C220 520 430 550 650 365 C900 155 1110 160 1510 42'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(var(--rgb-bg),0.86) 0%, rgba(var(--rgb-bg),0.42) 44%, rgba(var(--rgb-bg),0.2) 100%), linear-gradient(180deg, rgba(var(--rgb-bg),0.36) 0%, transparent 42%, rgba(var(--rgb-bg),0.94) 100%)",
            }}
          />
        </motion.div>

        {/* 3D Canvas */}
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "settled" ? 1 : exiting ? 0.18 : 0 }}
          transition={{ duration: exiting ? 0.9 : 1.6, ease: [0.16, 1, 0.3, 1] }}
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
                exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } }}
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
                exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.7 } }}
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
                exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.8, ease: [0.65, 0, 0.05, 1] } }}
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
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            maxWidth: "1440px",
            marginInline: "auto",
            paddingInline: "var(--gutter)",
            alignItems: intro ? "center" : "flex-start",
            justifyContent: intro ? "center" : "flex-end",
            paddingTop: intro ? undefined : "96px",
            paddingBottom: intro ? undefined : "clamp(2rem, 7vh, 7rem)",
            transition: "justify-content 1400ms var(--ease-cinema), align-items 1400ms var(--ease-cinema), padding 1400ms var(--ease-cinema)",
          }}
        >
          {/* Title — letters rain in */}
          <motion.h1
            id="prologue-title"
            layout
            initial={intro ? false : { opacity: 0, y: 22, filter: "blur(14px)", scale: 0.985 }}
            animate={{
              opacity: 1,
              y: exiting ? -4 : 0,
              filter: "blur(0px)",
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              filter: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.95, ease: [0.16, 1, 0.3, 1] },
              layout: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            }}
            className="font-sans font-black uppercase leading-[0.78] tracking-[-0.08em]"
            style={{
              fontSize: intro
                ? "clamp(3.2rem, 12vw, 8rem)"
                : "clamp(3rem, 10vw, 7.5rem)",
              textAlign: intro ? "center" : "left",
              fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 900,
              lineHeight: 0.78,
              letterSpacing: "-0.08em",
              textTransform: "uppercase",
              maxWidth: "min(100%, 11ch)",
            }}
          >
            <span className="sr-only">{brand.name}</span>

            <span aria-hidden className="block whitespace-nowrap">
              {INTRO_LINE_1.map((c, i) => (
                <RainLetter key={`d-${i}`} char={c} index={i} reduced={reduced} active={intro} gap={c === " "} />
              ))}
            </span>

            <span aria-hidden className="block whitespace-nowrap">
              {INTRO_LINE_2.map((c, i) => (
                <RainLetter
                  key={`f-${i}`}
                  char={c}
                  index={INTRO_LINE_1.length + i}
                  reduced={reduced}
                  active={intro}
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
      <div className="relative z-[5] overflow-hidden py-[clamp(4.5rem,14vh,12rem)]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-[-12vw] right-[-12vw] top-[6%] h-[72%]"
          style={{ y: manifestoLineY, opacity: manifestoGlow }}
        >
          <motion.svg
            viewBox="0 0 1200 520"
            preserveAspectRatio="none"
            className="h-full w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          >
            <defs>
              <linearGradient id="manifesto-path" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(122,167,255,0)" />
                <stop offset="42%" stopColor="rgba(122,167,255,0.85)" />
                <stop offset="58%" stopColor="rgba(244,241,234,0.9)" />
                <stop offset="100%" stopColor="rgba(122,167,255,0)" />
              </linearGradient>
              <filter id="manifesto-glow">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d="M -40 430 C 210 300 310 345 455 230 C 630 92 780 92 1240 16"
              fill="none"
              stroke="url(#manifesto-path)"
              strokeWidth="9"
              strokeLinecap="round"
              filter="url(#manifesto-glow)"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 },
              }}
              transition={{ duration: 1.65, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.path
              d="M -70 465 C 245 352 394 384 582 278 C 792 158 916 158 1280 96"
              fill="none"
              stroke="rgba(var(--rgb-fg),0.26)"
              strokeWidth="1.2"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1 },
              }}
              transition={{ delay: 0.18, duration: 1.85, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        </motion.div>
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[18%] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full"
          initial={{ opacity: 0, scale: 0.72 }}
          whileInView={{ opacity: 0.16, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -18% 0px" }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "radial-gradient(circle, rgba(122,167,255,0.58), transparent 68%)",
            filter: "blur(34px)",
          }}
        />
        <div className="mx-auto max-w-[1440px] px-[var(--gutter)]">
          <div className="relative grid grid-cols-12 gap-x-6 gap-y-12">
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
  active,
  small,
  silver,
  gap,
}: {
  char: string;
  index: number;
  reduced: boolean;
  active: boolean;
  small?: boolean;
  silver?: boolean;
  gap?: boolean;
}) {
  if (gap) return <span aria-hidden className="inline-block w-[0.22em]" />;

  const letterStyle = {
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
  };

  if (!active) {
    return (
      <span className="inline-block" style={letterStyle}>
        {char}
      </span>
    );
  }

  return (
    <motion.span
      className="inline-block"
      style={letterStyle}
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
