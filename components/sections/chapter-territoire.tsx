"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { EuropeMapData } from "@/lib/europe-map";
import { territoire } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";

const ROUTE_COLORS = [
  "rgba(122,167,255,0.95)",
  "rgba(244,241,234,0.85)",
  "rgba(166,255,203,0.7)",
  "rgba(184,192,204,0.85)",
  "rgba(122,167,255,0.6)",
];

export function ChapterTerritoire({ data }: { data: EuropeMapData }) {
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  const { viewBox, countries, cities, routes } = data;
  const drawableRoutes = routes.filter((r) => r.d.length > 0);
  const [activeRouteId, setActiveRouteId] = useState(drawableRoutes[0]?.id ?? "");
  const activeRoute = useMemo(
    () => drawableRoutes.find((r) => r.id === activeRouteId) ?? drawableRoutes[0],
    [activeRouteId, drawableRoutes],
  );

  const mapTransform = activeRoute
    ? `translate(${viewBox.w / 2} ${viewBox.h / 2}) scale(${activeRoute.focus.scale}) translate(${-activeRoute.focus.x} ${-activeRoute.focus.y})`
    : "translate(0 0) scale(1)";

  const selectRoute = (id: string) => {
    setActiveRouteId(id);
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    }
  };

  return (
    <section id="territoire" ref={ref} aria-labelledby="territoire-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <ChapterCard roman="II" title="Territoire" timecode="00:11:42" />

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-16">
          <div className="col-span-12 lg:col-span-5">
            <h2
              id="territoire-title"
              className="text-grad max-w-[11ch] font-sans font-medium leading-[0.96] tracking-[-0.025em] sm:max-w-none"
              style={{ fontSize: "clamp(2.25rem, 8vw, 4.4rem)" }}
            >
              <SplitTitle text="Une carte. Un terrain de jeu." />
            </h2>
            <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-7 sm:text-[16px]">
              {territoire.body} Au-dela du Grand-Duche, la communaute pousse jusqu'aux Ardennes belges, a la
              Moselle allemande, au lac de Come.
            </p>

            <ul className="no-scrollbar mt-8 flex gap-2 overflow-x-auto overflow-y-hidden pb-2 sm:block sm:overflow-visible sm:rounded-[28px] sm:p-2 sm:surface-soft sm:border-soft">
              {drawableRoutes.map((r, i) => (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                  transition={{ delay: 0.08 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="min-w-[250px] sm:min-w-0"
                >
                  <button
                    type="button"
                    aria-pressed={r.id === activeRouteId}
                    onClick={() => selectRoute(r.id)}
                    className={`press group flex w-full items-center justify-between gap-5 rounded-2xl border px-4 py-4 text-left transition-colors sm:border-0 sm:px-5 sm:py-3.5 ${
                      r.id === activeRouteId
                        ? "border-[rgba(122,167,255,0.42)] bg-[rgba(122,167,255,0.12)]"
                        : "border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-fg),0.035)] hover:bg-[rgba(var(--rgb-fg),0.06)] sm:bg-transparent"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-medium tabular"
                        style={{
                          background: `${ROUTE_COLORS[i % ROUTE_COLORS.length].replace(/[\d.]+\)/, "0.18)")}`,
                          color: ROUTE_COLORS[i % ROUTE_COLORS.length].replace(
                            /rgba\(([^)]+)\)/,
                            (_m, p1) => `rgb(${p1.split(",").slice(0, 3).join(",")})`,
                          ),
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate text-[14px] text-[var(--color-bone)] sm:text-[15px]">{r.name}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-[11px] text-[var(--color-silver-dim)] tabular sm:gap-4 sm:text-[12px]">
                      <span>{r.length}</span>
                      <span aria-hidden className="hidden text-[var(--color-silver-dim)] opacity-60 sm:inline">
                        -
                      </span>
                      <span className="hidden sm:inline">{r.elev}</span>
                    </div>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative col-span-12 lg:col-span-7" ref={mapRef}>
            <div
              className="relative min-h-[360px] w-full overflow-hidden rounded-[24px] surface-soft border-soft sm:rounded-[36px]"
              style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}` }}
            >
              <div aria-hidden className="absolute inset-0 tech-grid opacity-50" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(var(--rgb-fg),0.4) 50%, transparent)" }}
              />

              <svg
                viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
              >
                <defs>
                  <radialGradient id="point-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(122,167,255,0.7)" />
                    <stop offset="100%" stopColor="rgba(122,167,255,0)" />
                  </radialGradient>
                  <radialGradient id="origin-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(166,255,203,0.85)" />
                    <stop offset="100%" stopColor="rgba(166,255,203,0)" />
                  </radialGradient>
                  <filter id="route-glow">
                    <feGaussianBlur stdDeviation="2.4" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <motion.g
                  animate={{ transform: mapTransform }}
                  transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                >
                  {countries.map((c, i) => (
                    <motion.path
                      key={c.id}
                      d={c.d}
                      fill={c.isLU ? "rgba(122,167,255,0.18)" : "rgba(var(--rgb-fg),0.022)"}
                      stroke={c.isLU ? "rgba(122,167,255,0.85)" : "rgba(var(--rgb-fg),0.18)"}
                      strokeWidth={c.isLU ? 1.4 : 0.8}
                      strokeLinejoin="round"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                      transition={{
                        delay: 0.05 + Math.min(i, 24) * 0.008,
                        duration: 0.55,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />
                  ))}

                  {drawableRoutes.map((r, i) => {
                    const isActive = r.id === activeRouteId;
                    return (
                      <motion.path
                        key={r.id}
                        d={r.d}
                        fill="none"
                        stroke={ROUTE_COLORS[i % ROUTE_COLORS.length]}
                        strokeWidth={isActive ? "4.4" : "1.35"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#route-glow)"
                        style={{ pathLength: isActive ? 1 : draw }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0.36 }}
                        whileInView={{ opacity: isActive ? 1 : 0.5 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.18 + i * 0.06, duration: 0.55 }}
                      />
                    );
                  })}

                  {cities.map((c, i) => {
                    const isOrigin = c.key === "luxembourg";
                    return (
                      <g key={c.key}>
                        <motion.circle
                          cx={c.x}
                          cy={c.y}
                          r={isOrigin ? 22 : 14}
                          fill={isOrigin ? "url(#origin-glow)" : "url(#point-glow)"}
                          initial={{ opacity: 0, scale: 0.4 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.48 + i * 0.035, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {isOrigin ? (
                          <motion.circle
                            cx={c.x}
                            cy={c.y}
                            r={6}
                            fill="none"
                            stroke="rgba(166,255,203,0.7)"
                            strokeWidth="1"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1, 2.4, 2.4], opacity: [0.7, 0, 0] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                            style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                          />
                        ) : null}
                        <motion.circle
                          cx={c.x}
                          cy={c.y}
                          r={isOrigin ? 3.2 : 2.2}
                          fill={isOrigin ? "rgba(166,255,203,1)" : "rgba(var(--rgb-fg),0.95)"}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.55 + i * 0.035, duration: 0.35 }}
                        />
                        <motion.text
                          x={c.x + (isOrigin ? 12 : 9)}
                          y={c.y + 4}
                          fill={isOrigin ? "rgba(166,255,203,1)" : "rgba(var(--rgb-fg),0.85)"}
                          fontSize={isOrigin ? 11 : 9}
                          fontWeight={isOrigin ? 600 : 400}
                          letterSpacing="0.04em"
                          initial={{ opacity: 0, x: c.x + 4 }}
                          whileInView={{ opacity: 1, x: c.x + (isOrigin ? 12 : 9) }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.62 + i * 0.035, duration: 0.55 }}
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {c.short}
                        </motion.text>
                      </g>
                    );
                  })}
                </motion.g>
              </svg>

              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver)] backdrop-blur sm:left-6 sm:top-6">
                <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                Europe - Mercator
              </div>
              <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.04)] px-3 py-1 text-[10px] tracking-[0.05em] text-[var(--color-silver-dim)] backdrop-blur tabular sm:bottom-auto sm:right-6 sm:top-6">
                <span className="led-live h-[5px] w-[5px] rounded-full bg-[var(--color-signal)]" />
                {activeRoute?.name ?? "Luxembourg"}
              </span>
              <div className="absolute bottom-6 left-6 hidden max-w-[calc(100%-3rem)] flex-wrap gap-1.5 sm:flex">
                {drawableRoutes.map((r, i) => (
                  <span
                    key={r.id}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] tracking-[0.04em] backdrop-blur ${
                      r.id === activeRouteId
                        ? "bg-[rgba(122,167,255,0.14)] text-[var(--color-bone)]"
                        : "bg-[rgba(var(--rgb-fg),0.04)] text-[var(--color-silver)]"
                    }`}
                  >
                    <span
                      className="h-[5px] w-[5px] rounded-full"
                      style={{ background: ROUTE_COLORS[i % ROUTE_COLORS.length] }}
                    />
                    {r.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitTitle({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-baseline">
          <motion.span
            className="inline-block"
            initial={{ y: "100%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -18% 0px" }}
            transition={{ delay: i * 0.055, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}
