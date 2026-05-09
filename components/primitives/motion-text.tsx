"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { useIsTouch } from "@/lib/hooks";

type Props = {
  text: string;
  highlights?: string[];
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  staticOnTouch?: boolean;
};

export function MotionText({
  text,
  highlights = [],
  className,
  style,
  stagger = 0.025,
  duration = 0.7,
  as = "p",
  staticOnTouch = false,
}: Props) {
  const isTouch = useIsTouch();
  const words = text.split(/(\s+)/);
  const norm = (w: string) => w.toLowerCase().replace(/[.,;:!?'"()]/g, "");
  const isHighlight = (w: string) => highlights.some((h) => norm(w) === h.toLowerCase());

  const Wrapper = motion[as] as typeof motion.p;

  if (staticOnTouch && isTouch) {
    return (
      <Wrapper className={className} style={style}>
        {words.map((word, i) => {
          if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
          return (
            <span
              key={i}
              style={{
                color: isHighlight(word) ? "var(--color-bone)" : "rgba(184,192,204,0.72)",
                fontWeight: isHighlight(word) ? 620 : 400,
              }}
            >
              {word}
            </span>
          );
        })}
      </Wrapper>
    );
  }

  /* On touch devices, use a deeper viewport margin so the animation only
     fires once the user has clearly scrolled the section into view,
     preventing the "text was always there" feeling. */
  const viewportMargin = isTouch ? "0px 0px -30% 0px" : "0px 0px -18% 0px";

  return (
    <Wrapper
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ staggerChildren: stagger, delayChildren: isTouch ? 0.1 : 0 }}
    >
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>;
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline">
            <motion.span
              className="inline-block"
              style={{
                color: isHighlight(word) ? "var(--color-bone)" : "rgba(184,192,204,0.55)",
                fontWeight: isHighlight(word) ? 500 : 300,
              }}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { y: "0%", opacity: 1, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </Wrapper>
  );
}

