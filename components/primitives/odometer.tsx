"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { formatKm } from "@/lib/utils";

const MAX_KM = 187;

export function Odometer() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.6 });
  const km = useTransform(smooth, (v) => v * MAX_KM);
  const [text, setText] = useState("000.000");

  useEffect(() => {
    const unsub = km.on("change", (v) => setText(formatKm(v)));
    return () => unsub();
  }, [km]);

  return (
    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver)] tabular">
      <span className="opacity-60">ODO</span>
      <span className="text-[var(--color-bone)]">{text}</span>
      <span className="opacity-60">KM</span>
      <motion.span
        className="ml-1 inline-block h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
