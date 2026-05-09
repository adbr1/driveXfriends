"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { type MouseEvent, useRef } from "react";
import { invitation } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { MagneticButton } from "@/components/primitives/magnetic-button";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks";

export function ChapterInvitation() {
  return (
    <section id="invitation" aria-labelledby="invitation-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="V" title="Invitation" timecode="01:02:55" />
          </SequenceItem>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10 pb-[clamp(6rem,14vh,10rem)] md:mt-16 md:gap-y-16">
          <div className="col-span-12 md:col-span-5 md:pt-6">
            <RevealTitle
              id="invitation-title"
              className="text-grad font-sans font-medium leading-[0.96] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.25rem, 10vw, 4.6rem)" }}
            >
              L'invitation <span className="text-[var(--color-silver-dim)]">est personnelle.</span>
            </RevealTitle>
            <SequenceItem>
              <p className="mt-6 max-w-[40ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-8 sm:text-[17px]">
                {invitation.body}
              </p>
            </SequenceItem>
            <SequenceItem>
              <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-10">
              <MagneticButton href={invitation.ctaPrimary.href} variant="primary">
                {invitation.ctaPrimary.label}
              </MagneticButton>
              <MagneticButton href={invitation.ctaSecondary.href} variant="ghost">
                {invitation.ctaSecondary.label}
              </MagneticButton>
              </div>
            </SequenceItem>

            <SequenceItem>
              <ul className="mt-10 space-y-3 sm:mt-12">
              {[
                "Accès aux sorties privées et roadbooks réservés",
                "Invitations aux soirées membres et Cars & Coffee",
                "Communauté triée, courtoise, exigeante",
              ].map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                  transition={{ delay: 0.1 + i * 0.055, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-4 text-[15px] text-[var(--color-silver)]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(122,167,255,0.12)] text-[10px] text-[var(--color-volt)]">
                    ✓
                  </span>
                  {line}
                </motion.li>
              ))}
              </ul>
            </SequenceItem>
          </div>

          <SequenceItem className="col-span-12 flex items-center justify-center md:col-span-7">
            <Pass />
          </SequenceItem>
        </div>
        </SectionSequence>
      </div>
    </section>
  );
}

function Pass() {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 14, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 80, damping: 14, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-6, 6]);
  const lightX = useTransform(sx, [-0.5, 0.5], ["20%", "80%"]);
  const lightY = useTransform(sy, [-0.5, 0.5], ["20%", "80%"]);

  const onMove = (e: MouseEvent) => {
    if (isTouch || reduced || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-[600px]"
      style={{ perspective: 1600 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="relative aspect-[1.586/1] w-full overflow-hidden rounded-[24px] sm:rounded-[36px]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(135deg, rgba(28,28,32,0.95) 0%, rgba(15,15,18,0.92) 50%, rgba(8,8,10,0.96) 100%)",
          boxShadow:
            "0 50px 90px -30px rgba(0,0,0,0.8), 0 0 0 1px rgba(var(--rgb-fg),0.08), inset 0 1px 0 rgba(var(--rgb-fg),0.08)",
        }}
      >
        {/* gradient hairline border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[36px]"
          style={{
            padding: "1px",
            background:
              "linear-gradient(140deg, rgba(var(--rgb-fg),0.5), rgba(122,167,255,0.0) 30%, rgba(184,192,204,0.0) 70%, rgba(var(--rgb-fg),0.45))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Conic holographic wash */}
        <motion.div
          aria-hidden
          className="absolute -inset-[20%] opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(122,167,255,0.0), rgba(122,167,255,0.45) 25%, rgba(var(--rgb-fg),0.45) 50%, rgba(166,255,203,0.3) 75%, rgba(122,167,255,0.0))",
            filter: "blur(48px)",
            mixBlendMode: "screen",
          }}
          animate={reduced ? {} : { rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        />

        {/* Cursor specular highlight */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: useTransform(
              [lightX, lightY],
              ([x, y]) =>
                `radial-gradient(360px circle at ${x} ${y}, rgba(var(--rgb-fg),0.18), rgba(var(--rgb-fg),0.05) 30%, transparent 60%)`,
            ),
          }}
        />

        {/* tech grid */}
        <div aria-hidden className="absolute inset-0 tech-grid opacity-30" />

        <div className="relative z-[2] flex h-full flex-col justify-between p-5 sm:p-7 md:p-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                {invitation.card.club}
              </span>
              <span className="text-[11px] tracking-[0.04em] text-[var(--color-silver-dim)]">
                {invitation.card.holder}
              </span>
            </div>
            <div className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[rgba(166,255,203,0.08)] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-[var(--color-signal)] backdrop-blur">
              <span className="led-live inline-block h-[6px] w-[6px] rounded-full bg-[var(--color-signal)]" />
              Live
            </div>
          </div>

          {/* Center sigil */}
          <div className="flex items-center justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24 md:h-28 md:w-28">
              <div className="absolute inset-0 rounded-full border border-[rgba(var(--rgb-fg),0.35)]" />
              <div className="absolute inset-3 rounded-full border border-[rgba(var(--rgb-fg),0.18)]" />
              <span className="text-grad font-sans text-3xl font-medium md:text-4xl">×</span>
              <motion.div
                aria-hidden
                className="absolute -inset-3 rounded-full border border-dashed border-[rgba(122,167,255,0.35)]"
                animate={reduced ? {} : { rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                Série
              </span>
              <span className="font-mono text-[13px] tracking-[0.06em] text-[var(--color-bone)] tabular md:text-[14px]">
                {invitation.card.series}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                Émis · {invitation.card.issued}
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-signal)]">
                {invitation.card.valid}
              </span>
            </div>
          </div>
        </div>

        {/* Diagonal sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(var(--rgb-fg),0.08) 50%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Reflection */}
      <div
        aria-hidden
        className="mx-auto mt-3 h-16 w-[88%] opacity-40"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(var(--rgb-fg),0.22), transparent 75%)",
          filter: "blur(10px)",
        }}
      />
    </motion.div>
  );
}
