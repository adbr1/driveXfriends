"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "ghost",
  className,
  ariaLabel,
}: Props) {
  const reduced = usePrefersReducedMotion();

  const styles = cn(
    "group relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-full overflow-hidden",
    "px-7 py-3.5 text-[13px] font-medium tracking-[0.01em]",
    "transition-[box-shadow,background-color,color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "will-change-transform active:scale-[0.97]",
    variant === "primary"
      ? "bg-[var(--color-bone)] text-[var(--color-ink)] shadow-[0_8px_30px_-10px_rgba(var(--rgb-fg),0.45)] hover:shadow-[0_18px_50px_-12px_rgba(var(--rgb-fg),0.6)]"
      : "surface-soft border-soft text-[var(--color-bone)] hover:bg-[rgba(var(--rgb-fg),0.06)]",
    className,
  );

  const motionProps = reduced
    ? {}
    : { whileTap: { scale: 0.97 }, transition: { type: "spring" as const, stiffness: 500, damping: 28 } };

  const inner = (
    <span className="relative inline-flex items-center gap-2.5">
      <span className="relative z-[1]">{children}</span>
      <span
        aria-hidden
        className="relative z-[1] ml-0.5 inline-block translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        →
      </span>
      {variant === "primary" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 translate-y-full bg-gradient-to-t from-white to-transparent opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-50"
        />
      ) : null}
    </span>
  );

  if (href) {
    return (
      <motion.a href={href} className={styles} aria-label={ariaLabel} {...motionProps}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={styles}
      aria-label={ariaLabel}
      type="button"
      {...motionProps}
    >
      {inner}
    </motion.button>
  );
}
