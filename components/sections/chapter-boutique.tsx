"use client";

import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import { shop, brand } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { SectionSequence, SequenceItem, RevealTitle } from "@/components/primitives/section-sequence";

const staggerCard = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: 8,
    scale: 0.92,
    filter: "blur(8px)",
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.18,
      duration: 0.95,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const floatOrb = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const tagReveal = {
  hidden: { opacity: 0, y: 12, scale: 0.88 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.4 + i * 0.06,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const shimmer = {
  hidden: { x: "-100%", opacity: 0 },
  visible: {
    x: "200%",
    opacity: [0, 0.7, 0],
    transition: { duration: 1.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ChapterBoutique() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "0px 0px -20% 0px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const orbRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      id="boutique"
      ref={sectionRef}
      aria-labelledby="boutique-title"
      className="relative overflow-hidden"
    >
      {/* Floating ambient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[-10%] top-[8%] h-[380px] w-[380px] rounded-full"
        variants={floatOrb}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          y: orbY1,
          rotate: orbRotate,
          background: "radial-gradient(circle, rgba(122,167,255,0.22), transparent 68%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-8%] top-[40%] h-[320px] w-[320px] rounded-full"
        variants={floatOrb}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          y: orbY2,
          background: "radial-gradient(circle, rgba(166,255,203,0.14), transparent 68%)",
          filter: "blur(50px)",
        }}
      />
      {/* Decorative horizontal line */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[1px]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.18) 20%, rgba(122,167,255,0.38) 50%, rgba(var(--rgb-fg),0.18) 80%, transparent)",
          transformOrigin: "left",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)] pb-[clamp(5rem,12vh,9rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="VII" title="Boutique" timecode="01:18:44" />
          </SequenceItem>

          <div className="mt-10 grid gap-10 md:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <RevealTitle
                id="boutique-title"
                className="text-grad font-sans font-medium leading-[0.96] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.25rem, 10vw, 5rem)" }}
              >
                Objets de <span className="text-[var(--color-silver-dim)]">club.</span>
              </RevealTitle>
            </div>
            <SequenceItem>
              <p className="max-w-[48ch] text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.65] text-[var(--color-silver)]">
                {shop.body}
              </p>
            </SequenceItem>
          </div>

          {/* Product grid with staggered 3D card reveals */}
          <div
            className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:gap-5"
            style={{ perspective: "1200px" }}
          >
            {shop.products.map((product, index) => {
              const href = `mailto:${brand.email}?subject=${encodeURIComponent(
                `Precommande ${product.name} - Drive x Friends`,
              )}&body=${encodeURIComponent(
                `Bonjour Drive x Friends,\n\nJe souhaite demander une precommande pour : ${product.name}.\nTaille souhaitee : \nNom : \nTelephone : \n\nMerci.`,
              )}`;
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={href}
                  index={index}
                  isInView={isInView}
                />
              );
            })}
          </div>
        </SectionSequence>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  href,
  index,
  isInView,
}: {
  product: (typeof shop.products)[number];
  href: string;
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);

  return (
    <motion.article
      ref={cardRef}
      custom={index}
      variants={staggerCard}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -6, scale: 1.015, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      className="surface-soft border-soft group relative overflow-hidden rounded-[26px] p-3 sm:rounded-[32px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Shimmer sweep on reveal */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        variants={shimmer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{
          background:
            "linear-gradient(105deg, transparent 30%, rgba(244,241,234,0.12) 45%, rgba(122,167,255,0.08) 55%, transparent 70%)",
          width: "50%",
        }}
      />

      <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[rgba(var(--rgb-fg),0.04)]">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={
            isInView
              ? { scale: 1, opacity: 0.9, transition: { delay: index * 0.18 + 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
              : {}
          }
          whileHover={{ scale: 1.06, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(var(--rgb-bg),0.05), rgba(var(--rgb-bg),0.52)), radial-gradient(ellipse at 72% 18%, rgba(244,241,234,0.14), transparent 42%)",
          }}
        />
        {/* Status badge with entrance animation */}
        <motion.div
          className="absolute left-4 top-4 rounded-full bg-[rgba(var(--rgb-bg),0.64)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-bone)] backdrop-blur"
          initial={{ opacity: 0, y: -10, scale: 0.85 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1, transition: { delay: index * 0.18 + 0.5, duration: 0.55, ease: [0.16, 1, 0.3, 1] } }
              : {}
          }
        >
          {product.status}
        </motion.div>
        {/* Product name at bottom of image */}
        <motion.div
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 16 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, transition: { delay: index * 0.18 + 0.55, duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
              : {}
          }
        >
          <h2 className="text-3xl font-medium leading-none text-[var(--color-bone)]">
            {product.name}
          </h2>
        </motion.div>
      </div>

      {/* Card body */}
      <motion.div
        className="p-3 pt-5 sm:p-5"
        initial={{ opacity: 0, y: 12 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, transition: { delay: index * 0.18 + 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            : {}
        }
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-[var(--color-silver)]">{product.price}</span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-silver-dim)]">
            {product.sizes.join(" / ")}
          </span>
        </div>
        <p className="mt-4 min-h-[72px] text-sm leading-6 text-[var(--color-silver)]">
          {product.description}
        </p>
        <motion.a
          href={href}
          className="press mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-bone)] px-5 text-[13px] font-medium text-[var(--color-ink)] relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Button glow on hover */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            style={{
              background:
                "radial-gradient(ellipse at 50% 100%, rgba(122,167,255,0.22), transparent 70%)",
            }}
          />
          <span className="relative">{shop.cta}</span>
        </motion.a>
      </motion.div>
    </motion.article>
  );
}
