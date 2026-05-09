"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { chapters } from "@/lib/content";
import { BrandMark } from "@/components/primitives/brand-mark";
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

const mobilePanel = {
  closed: {
    opacity: 0,
    y: -12,
    scale: 0.96,
    filter: "blur(12px)",
    pointerEvents: "none" as const,
    transition: { duration: 0.28, ease: [0.65, 0, 0.05, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    pointerEvents: "auto" as const,
    transition: {
      duration: 0.46,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.055,
      delayChildren: 0.08,
    },
  },
};

const mobileLink = {
  closed: { opacity: 0, y: -8, scale: 0.98 },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollYProgress } = useScroll();
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [active, setActive] = useState<string>("prologue");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    const complete = () => setVisible(true);

    if (!isHome) {
      complete();
      return;
    }
    if (sessionStorage.getItem(INTRO_SESSION_KEY)) complete();

    window.addEventListener(INTRO_COMPLETE_EVENT, complete);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, complete);
  }, [isHome]);

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

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      {/* Soft blur strip behind the nav — fades out vertically */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[220px] md:h-[200px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backdropFilter: "blur(14px) saturate(120%)",
          WebkitBackdropFilter: "blur(14px) saturate(120%)",
          background:
            "linear-gradient(180deg, rgba(var(--rgb-bg),0.62) 0%, rgba(var(--rgb-bg),0.34) 34%, rgba(var(--rgb-bg),0.12) 62%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.95) 28%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.16) 78%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.95) 28%, rgba(0,0,0,0.55) 58%, rgba(0,0,0,0.16) 78%, transparent 100%)",
        }}
      />

      <motion.div
        aria-hidden
        className="fixed inset-0 z-[58] md:hidden"
        initial={false}
        animate={{
          opacity: open && visible ? 1 : 0,
          pointerEvents: open && visible ? "auto" : "none",
        }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backdropFilter: "blur(18px) saturate(132%)",
          WebkitBackdropFilter: "blur(18px) saturate(132%)",
          background:
            "linear-gradient(180deg, rgba(var(--rgb-bg),0.68), rgba(var(--rgb-bg),0.48) 48%, rgba(var(--rgb-bg),0.72))",
        }}
        onClick={() => setOpen(false)}
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
          "fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-4 md:px-4 md:pt-6",
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
        <div className="relative flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-bg),0.34)] p-1.5 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-0">
          <motion.a
            variants={navItem}
            href={sectionHref("prologue")}
            aria-label="Drive x Friends — accueil"
            className="surface-soft border-soft press group flex h-[52px] items-center gap-2.5 rounded-full px-4 text-[var(--color-bone)] transition-colors hover:text-[var(--color-bone)] md:h-11 md:gap-2.5 md:px-4"
          >
            <span aria-hidden className="relative inline-flex h-[22px] w-[22px] items-center justify-center md:h-[18px] md:w-[18px]">
              <span className="absolute inset-0 rounded-full border border-[rgba(var(--rgb-fg),0.5)] transition-all duration-500 group-hover:border-[rgba(var(--rgb-fg),0.85)] group-hover:rotate-90" />
              <span className="text-[12px] font-medium leading-none text-current md:text-[10px]">×</span>
            </span>
            <BrandMark compact className="scale-[0.82] text-[var(--color-bone)] md:scale-[0.72]" />
          </motion.a>

          <motion.nav
            variants={navItem}
            aria-label="Chapitres"
            className="surface-soft border-soft hidden h-11 items-center gap-1 rounded-full p-1 md:flex"
          >
            {chapters.map((c) => {
              const isActive = isHome && c.id === active;
              return (
                <a
                  key={c.id}
                  href={sectionHref(c.id)}
                  className={cn(
                    "relative inline-flex h-9 items-center rounded-full px-4 text-[12px] font-medium tracking-[0.01em] transition-colors duration-300",
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
            href={sectionHref("invitation")}
            className="surface-soft border-soft press hidden h-11 items-center gap-2 rounded-full px-4 text-[12px] font-medium text-[var(--color-bone)] transition-colors md:inline-flex"
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
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="surface-soft border-soft press flex h-[52px] w-[52px] items-center justify-center rounded-full text-[var(--color-bone)] md:hidden"
          >
            <span aria-hidden className="relative h-[12px] w-[18px]">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-[1px] bg-current transition-transform duration-300",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 bottom-0 h-[1px] bg-current transition-transform duration-300",
                  open && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </motion.button>
        </div>

        <motion.div
          initial={false}
          variants={mobilePanel}
          animate={open ? "open" : "closed"}
          className="absolute left-3 right-3 top-[86px] z-[65] md:hidden"
        >
          <div
            className="border-soft rounded-[28px] border border-[rgba(var(--rgb-fg),0.16)] p-2 shadow-[0_34px_110px_-32px_rgba(0,0,0,0.96)]"
            style={{
              background:
                "linear-gradient(180deg, rgba(var(--rgb-bg),0.74), rgba(var(--rgb-bg),0.52)), rgba(122,167,255,0.08)",
              backdropFilter: "blur(20px) saturate(140%) contrast(1.04)",
              WebkitBackdropFilter: "blur(20px) saturate(140%) contrast(1.04)",
            }}
          >
            {chapters.map((c) => (
              <motion.a
                variants={mobileLink}
                key={c.id}
                href={sectionHref(c.id)}
                onClick={() => setOpen(false)}
                className={cn(
                  "press flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors",
                  isHome && c.id === active
                    ? "bg-[var(--color-bone)] text-[var(--color-ink)]"
                    : "text-[var(--color-silver)] hover:text-[var(--color-bone)]",
                )}
              >
                <span>{c.title}</span>
                <span className="opacity-50">{c.roman}</span>
              </motion.a>
            ))}

            <motion.a
              variants={mobileLink}
              href={sectionHref("invitation")}
              onClick={() => setOpen(false)}
              className="press mt-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-bone)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
            >
              <span className="led-live h-[6px] w-[6px] rounded-full bg-[var(--color-signal)]" />
              Adhérer
            </motion.a>
          </div>
        </motion.div>
      </motion.header>
    </>
  );
}
