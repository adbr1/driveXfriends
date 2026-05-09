"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { contact } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks";

export function ChapterContact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="VI" title="Contact" timecode="01:10:03" />
          </SequenceItem>

          <div className="mt-12 max-w-[60ch] md:mt-16">
            <RevealTitle
              id="contact-title"
              className="text-grad font-sans font-medium leading-[0.95] tracking-[-0.025em]"
              style={{ fontSize: "clamp(2.25rem, 10vw, 4.6rem)" }}
            >
              Écrivez. Suivez. <span className="text-[var(--color-silver-dim)]">Conduisez.</span>
            </RevealTitle>
          </div>

          <SequenceItem>
            <ul className="mt-12 flex flex-col gap-3 pb-[clamp(4rem,10vh,8rem)] md:mt-20">
              {contact.lines.map((line) => (
                <li key={line.label}>
                  <ContactCard line={line} />
                </li>
              ))}
            </ul>
          </SequenceItem>
        </SectionSequence>
      </div>
    </section>
  );
}

function ContactCard({ line }: { line: (typeof contact.lines)[number] }) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 80, damping: 16, mass: 0.5 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [2.4, -2.4]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-2.4, 2.4]);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    ref.current.style.setProperty("--mx", `${px}px`);
    ref.current.style.setProperty("--my", `${py}px`);
    if (isTouch || reduced) return;
    mx.set(px / r.width - 0.5);
    my.set(py / r.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  return (
    <motion.a
      ref={ref}
      href={line.href}
      target={line.external ? "_blank" : undefined}
      rel={line.external ? "noopener noreferrer" : undefined}
      aria-label={`${line.label} : ${line.value}`}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      className="halo surface-soft border-soft group flex min-h-[150px] flex-col gap-4 overflow-hidden rounded-[22px] p-5 transition-colors will-change-transform sm:rounded-[28px] sm:p-7 md:min-h-[164px] md:flex-row md:items-center md:justify-between md:p-9"
    >
      <span className="relative z-[1] inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver)]">
        <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
        {line.label}
      </span>
      <span className="relative z-[1] flex min-w-0 flex-1 items-center gap-3 md:justify-end">
        <OneLineFitText text={line.value} hover={hover} />
        <motion.span
          aria-hidden
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(var(--rgb-fg),0.06)] text-[var(--color-silver-dim)] transition-colors duration-500 group-hover:text-[var(--color-volt)] sm:h-12 sm:w-12"
          animate={{ opacity: hover ? 1 : 0.72, scale: hover ? 1.04 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          →
        </motion.span>
      </span>
    </motion.a>
  );
}

function OneLineFitText({ text, hover }: { text: string; hover: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(76);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const fit = () => {
      const max = window.matchMedia("(min-width: 768px)").matches ? 76 : 54;
      const min = 24;
      measure.style.fontSize = `${max}px`;
      const available = container.clientWidth;
      const natural = measure.scrollWidth || 1;
      setFontSize(Math.max(min, Math.min(max, Math.floor(max * (available / natural)))));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [text]);

  return (
    <span ref={containerRef} className="relative min-w-0 flex-1 overflow-hidden">
      <span
        aria-hidden
        ref={measureRef}
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap font-sans font-medium tracking-[-0.025em]"
      >
        {text}
      </span>
      <motion.span
        className="block whitespace-nowrap font-sans font-medium leading-[1] tracking-[-0.025em] text-[var(--color-bone)] transition-colors duration-500 group-hover:text-white"
        style={{ fontSize }}
        animate={{ opacity: hover ? 1 : 0.92 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
}
