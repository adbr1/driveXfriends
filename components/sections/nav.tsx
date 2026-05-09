"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { chapters } from "@/lib/content";
import { cn } from "@/lib/utils";

const INTRO_SESSION_KEY = "dxf-prologue-played";
const INTRO_COMPLETE_EVENT = "dxf:intro-complete";

const navShell = {
  hidden: {
    opacity: 0,
    y: -34,
    scale: 0.96,
    filter: "blur(14px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.075,
      delayChildren: 0.16,
    },
  },
};

const navItem = {
  hidden: { opacity: 0, y: -12, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Nav() {
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [active, setActive] = useState<string>("prologue");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const complete = () => setVisible(true);

    if (sessionStorage.getItem(INTRO_SESSION_KEY)) complete();

    window.addEventListener(INTRO_COMPLETE_EVENT, complete);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, complete);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    chapters.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* Soft blur strip behind the nav — fades out vertically */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[110px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backdropFilter: "blur(10px) saturate(120%)",
          WebkitBackdropFilter: "blur(10px) saturate(120%)",
          background: "linear-gradient(180deg, rgba(var(--rgb-bg),0.45) 0%, rgba(var(--rgb-bg),0.18) 55%, transparent 100%)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 60%, transparent 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className="fixed left-0 right-0 top-0 z-[70] h-[1px] origin-left"
        style={{
          scaleX: visible ? progressScale : 0,
          background:
            "linear-gradient(90deg, rgba(var(--rgb-fg),0), rgba(var(--rgb-fg),0.85), rgba(122,167,255,0.85))",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.65, delay: 0.25 }}
      />

      <motion.header
        variants={navShell}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4 md:pt-6",
          !visible && "pointer-events-none",
        )}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-2 h-16 w-[min(720px,90vw)] rounded-full"
          initial={{ opacity: 0, scaleX: 0.35 }}
          animate={visible ? { opacity: [0, 0.45, 0.16], scaleX: [0.35, 1.08, 1] } : { opacity: 0, scaleX: 0.35 }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(122,167,255,0.38), rgba(var(--rgb-fg),0.28), transparent)",
            filter: "blur(18px)",
          }}
        />
        <div className="relative flex items-center gap-2">
          <motion.a
            variants={navItem}
            href="#prologue"
            aria-label="Drive x Friends — accueil"
            className="surface-soft border-soft press group flex items-center gap-2.5 rounded-full px-4 py-2.5 text-[var(--color-bone)] transition-colors hover:text-[var(--color-bone)]"
          >
            <span aria-hidden className="relative inline-flex h-[18px] w-[18px] items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-[rgba(var(--rgb-fg),0.5)] transition-all duration-500 group-hover:border-[rgba(var(--rgb-fg),0.85)] group-hover:rotate-90" />
              <span className="text-[10px] font-medium leading-none text-current">×</span>
            </span>
            <span className="text-[12px] font-medium tracking-[0.04em]">
              Drive <span className="text-[var(--color-silver)]">×</span> Friends
            </span>
          </motion.a>

          <motion.nav
            variants={navItem}
            aria-label="Chapitres"
            className="surface-soft border-soft hidden items-center gap-1 rounded-full p-1 md:flex"
          >
            {chapters.map((c) => {
              const isActive = c.id === active;
              return (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[12px] font-medium tracking-[0.01em] transition-colors duration-300",
                    isActive
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-silver)] hover:text-[var(--color-bone)]",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-[var(--color-bone)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{c.title}</span>
                </a>
              );
            })}
          </motion.nav>

          <motion.a
            variants={navItem}
            href="#invitation"
            className="surface-soft border-soft press hidden items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-medium text-[var(--color-bone)] transition-colors md:inline-flex"
          >
            <span className="led-live h-[6px] w-[6px] rounded-full bg-[var(--color-signal)]" />
            Adhérer
          </motion.a>

          <motion.button
            variants={navItem}
            type="button"
            aria-expanded={open}
            aria-label="Ouvrir le menu"
            onClick={() => setOpen((v) => !v)}
            className="surface-soft border-soft press flex h-[42px] w-[42px] items-center justify-center rounded-full text-[var(--color-bone)] md:hidden"
          >
            <span aria-hidden className="relative h-[10px] w-[14px]">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-[1px] bg-current transition-transform duration-300",
                  open && "translate-y-[4px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 bottom-0 h-[1px] bg-current transition-transform duration-300",
                  open && "-translate-y-[5px] -rotate-45",
                )}
              />
            </span>
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={open ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, y: -8, pointerEvents: "none" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-4 right-4 top-[68px] z-[55] md:hidden"
        >
          <div className="surface-soft border-soft rounded-3xl p-2">
            {chapters.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={() => setOpen(false)}
                className={cn(
                  "press flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors",
                  c.id === active
                    ? "bg-[var(--color-bone)] text-[var(--color-ink)]"
                    : "text-[var(--color-silver)] hover:text-[var(--color-bone)]",
                )}
              >
                <span>{c.title}</span>
                <span className="opacity-50">{c.roman}</span>
              </a>
            ))}
            <a
              href="#invitation"
              onClick={() => setOpen(false)}
              className="press mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-bone)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
            >
              <span className="led-live h-[6px] w-[6px] rounded-full bg-[var(--color-signal)]" />
              Adhérer
            </a>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
}
