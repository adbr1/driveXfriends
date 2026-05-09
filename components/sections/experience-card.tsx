"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { type MouseEvent, useRef, useState } from "react";
import { useIsTouch, usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  index: number;
  label: string;
  title: string;
  body: string;
  image: { src: string; alt: string };
};

export function ExperienceCard({ index, label, title, body, image }: Props) {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 80, damping: 16, mass: 0.5 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-3, 3]);

  const onMove = (e: MouseEvent<HTMLElement>) => {
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
    <motion.article
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      className="halo surface-soft border-soft group relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[22px] p-5 will-change-transform sm:rounded-[28px] sm:p-7 md:p-9"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ delay: 0.08 + index * 0.055, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top inner highlight (Apple) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.5) 50%, transparent)",
        }}
      />

      <div className="relative z-[1] flex items-start justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
          <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
          {label}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-dim)]">
          0{index + 1}
        </span>
      </div>

      <div className="relative z-[1] my-7 h-[190px] sm:my-10 sm:h-[220px] md:my-12">
        <Visual image={image} hover={hover} />
      </div>

      <div className="relative z-[1]">
        <h3 className="text-grad font-sans text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-[1.05] tracking-[-0.015em]">
          {title}
        </h3>
        <p className="mt-4 max-w-[36ch] text-[15px] leading-[1.6] text-[var(--color-silver)]">
          {body}
        </p>
        <motion.div
          className="mt-6 flex items-center gap-2 text-[12px] font-medium text-[var(--color-bone)]"
          animate={{ x: hover ? 4 : 0, opacity: hover ? 1 : 0.7 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>En savoir plus</span>
          <span aria-hidden>→</span>
        </motion.div>
      </div>
    </motion.article>
  );
}

function Visual({ image, hover }: { image: { src: string; alt: string }; hover: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden rounded-[18px] border border-[rgba(var(--rgb-fg),0.07)] bg-[rgba(var(--rgb-fg),0.035)]"
      animate={{ scale: hover ? 1.015 : 1 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="h-full w-full object-cover opacity-75 grayscale transition duration-700 group-hover:scale-[1.04] group-hover:opacity-90 group-hover:grayscale-0"
        loading="lazy"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(var(--rgb-bg),0.04), rgba(var(--rgb-bg),0.35)), radial-gradient(ellipse at 80% 20%, rgba(122,167,255,0.2), transparent 50%)",
        }}
      />
    </motion.div>
  );
}
