"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

type Props = {
  text: string;
  highlights?: string[];
  className?: string;
  style?: CSSProperties;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

export function MotionText({
  text,
  highlights = [],
  className,
  style,
  stagger = 0.025,
  duration = 0.7,
  as = "p",
}: Props) {
  const words = text.split(/(\s+)/);
  const norm = (w: string) => w.toLowerCase().replace(/[.,;:!?'"()]/g, "");
  const isHighlight = (w: string) => highlights.some((h) => norm(w) === h.toLowerCase());

  const Wrapper = motion[as] as typeof motion.p;

  return (
    <Wrapper
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
      transition={{ staggerChildren: stagger }}
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
