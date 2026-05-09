"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.04,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.78,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

type SequenceProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

export function SectionSequence({ children, className, ...props }: SequenceProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -22% 0px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export const SequenceItem = forwardRef<HTMLDivElement, SequenceProps>(function SequenceItem(
  { children, className, ...props },
  ref,
) {
  return (
    <motion.div ref={ref} variants={item} className={cn("relative", className)} {...props}>
      {children}
    </motion.div>
  );
});

type RevealTitleProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  mutedFrom?: number;
  style?: CSSProperties;
};

export function RevealTitle({ children, className, id, style }: RevealTitleProps) {
  return (
    <motion.h2
      id={id}
      variants={item}
      className={className}
      style={style}
    >
      {children}
    </motion.h2>
  );
}
