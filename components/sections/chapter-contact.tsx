"use client";

import { motion } from "motion/react";
import { contact } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";

export function ChapterContact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <ChapterCard roman="VI" title="Contact" timecode="01:10:03" />

        <div className="mt-12 max-w-[60ch] md:mt-16">
          <h2
            id="contact-title"
            className="text-grad font-sans font-medium leading-[0.95] tracking-[-0.025em]"
            style={{ fontSize: "clamp(2.25rem, 10vw, 4.6rem)" }}
          >
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              >
                Écrivez. Suivez.
              </motion.span>
            </span>
            <span className="block overflow-hidden text-[var(--color-silver-dim)]">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Conduisez.
              </motion.span>
            </span>
          </h2>
        </div>

        <ul className="mt-12 flex flex-col gap-3 pb-[clamp(4rem,10vh,8rem)] md:mt-20">
          {contact.lines.map((line, i) => (
            <motion.li
              key={line.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -18% 0px" }}
              transition={{ delay: i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={line.href}
                target={line.external ? "_blank" : undefined}
                rel={line.external ? "noopener noreferrer" : undefined}
                aria-label={`${line.label} : ${line.value}`}
                className="surface-soft border-soft halo group flex flex-col gap-4 overflow-hidden rounded-[22px] p-5 transition-colors sm:rounded-[28px] sm:p-7 md:flex-row md:items-center md:justify-between md:p-9"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver)]">
                  <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                  {line.label}
                </span>
                <span
                  className="font-sans font-medium leading-[1] tracking-[-0.025em] text-[var(--color-bone)] transition-colors duration-500 group-hover:text-white"
                  style={{ fontSize: "clamp(1.6rem, 9vw, 5rem)" }}
                >
                  {line.value}
                  <motion.span
                    aria-hidden
                    className="ml-3 inline-block text-[var(--color-silver-dim)] transition-colors duration-500 group-hover:text-[var(--color-volt)]"
                  >
                    →
                  </motion.span>
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
