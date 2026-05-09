"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { EuropeMapData } from "@/lib/europe-map";
import { territoire } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";

const EVENT_COLORS = [
  "rgba(122,167,255,0.98)",
  "rgba(166,255,203,0.82)",
  "rgba(244,241,234,0.86)",
  "rgba(184,192,204,0.82)",
];

export function ChapterTerritoire({ data }: { data: EuropeMapData }) {
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);

  const { viewBox, countries, cities, events, roads } = data;
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? "");
  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [activeEventId, events],
  );

  const mapViewBox = activeEvent
    ? (() => {
        const scale = activeEvent.focus.scale * 1.16;
        const w = viewBox.w / scale;
        const h = viewBox.h / scale;
        return `${activeEvent.focus.x - w / 2} ${activeEvent.focus.y - h / 2} ${w} ${h}`;
      })()
    : `0 0 ${viewBox.w} ${viewBox.h}`;

  const selectEvent = (id: string) => {
    setActiveEventId(id);
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.setTimeout(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 90);
    }
  };

  return (
    <section id="territoire" ref={ref} aria-labelledby="territoire-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="II" title="Territoire" timecode="00:11:42" />
          </SequenceItem>

          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-16">
            <div className="col-span-12 lg:col-span-5">
              <RevealTitle
                id="territoire-title"
                className="text-grad max-w-[11ch] font-sans font-medium leading-[0.96] tracking-[-0.025em] sm:max-w-none"
                style={{ fontSize: "clamp(2.25rem, 8vw, 4.4rem)" }}
              >
                Une carte. Un terrain de jeu.
              </RevealTitle>
              <SequenceItem>
                <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-7 sm:text-[16px]">
                  {territoire.body} Les prochains rendez-vous dessinent une saison entre Luxembourg, Foret-Noire
                  et Côte d'Azur.
                </p>
              </SequenceItem>

              <SequenceItem>
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                      Prochains événements
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-silver-dim)]">
                      Linktree
                    </span>
                  </div>
                  <ul className="no-scrollbar flex gap-2 overflow-x-auto overflow-y-hidden pb-2 sm:block sm:overflow-visible sm:rounded-[28px] sm:p-2 sm:surface-soft sm:border-soft">
                    {events.map((event, i) => (
                      <li key={event.id} className="min-w-[282px] sm:min-w-0">
                        <button
                          type="button"
                          aria-pressed={event.id === activeEventId}
                          onClick={() => selectEvent(event.id)}
                          className={`press group flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition-colors sm:border-0 sm:px-5 sm:py-4 ${
                            event.id === activeEventId
                              ? "border-[rgba(122,167,255,0.42)] bg-[rgba(122,167,255,0.13)]"
                              : "border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-fg),0.035)] hover:bg-[rgba(var(--rgb-fg),0.06)] sm:bg-transparent"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <span
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-medium tabular"
                              style={{
                                background: `${EVENT_COLORS[i % EVENT_COLORS.length].replace(/[\d.]+\)/, "0.18)")}`,
                                color: EVENT_COLORS[i % EVENT_COLORS.length].replace(
                                  /rgba\(([^)]+)\)/,
                                  (_m, p1) => `rgb(${p1.split(",").slice(0, 3).join(",")})`,
                                ),
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[14px] text-[var(--color-bone)] sm:text-[15px]">
                                {event.name}
                              </span>
                              <span className="mt-1 block truncate text-[11px] text-[var(--color-silver-dim)]">
                                {event.date} - {event.location}
                              </span>
                            </span>
                          </div>
                          <span className="shrink-0 text-[11px] text-[var(--color-silver-dim)] tabular">
                            {event.distance}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </SequenceItem>
            </div>

            <SequenceItem className="relative col-span-12 lg:col-span-7" ref={mapRef}>
              <div
                className="relative min-h-[380px] w-full overflow-hidden rounded-[24px] surface-soft border-soft sm:rounded-[36px]"
                style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}` }}
              >
                <div aria-hidden className="absolute inset-0 tech-grid opacity-40" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 45%, rgba(122,167,255,0.12), transparent 48%), linear-gradient(180deg, rgba(var(--rgb-bg),0.08), rgba(var(--rgb-bg),0.32))",
                  }}
                />

                <motion.svg
                  viewBox={mapViewBox}
                  animate={{ viewBox: mapViewBox }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                >
                  <defs>
                    <filter id="event-route-glow">
                      <feGaussianBlur stdDeviation="4.8" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="city-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(122,167,255,0.58)" />
                      <stop offset="100%" stopColor="rgba(122,167,255,0)" />
                    </radialGradient>
                    <radialGradient id="origin-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(166,255,203,0.85)" />
                      <stop offset="100%" stopColor="rgba(166,255,203,0)" />
                    </radialGradient>
                  </defs>

                  <g>
                    {countries.map((country, i) => (
                      <motion.path
                        key={country.id}
                        d={country.d}
                        fill={country.isLU ? "rgba(122,167,255,0.2)" : "rgba(var(--rgb-fg),0.024)"}
                        stroke={country.isLU ? "rgba(122,167,255,0.92)" : "rgba(var(--rgb-fg),0.28)"}
                        strokeWidth={country.isLU ? 1.18 : 0.46}
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
                        transition={{ delay: 0.04 + i * 0.018, duration: 0.5 }}
                      />
                    ))}

                    {roads.map((road) => (
                      <motion.path
                        key={road.id}
                        d={road.d}
                        fill="none"
                        stroke={road.kind === "primary" ? "rgba(var(--rgb-fg),0.18)" : "rgba(var(--rgb-fg),0.1)"}
                        strokeWidth={road.kind === "primary" ? 1.15 : 0.68}
                        strokeDasharray={road.kind === "primary" ? "0" : "3 5"}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        style={{ pathLength: draw }}
                      />
                    ))}

                    {events.filter((event) => event.id !== activeEventId).map((event, i) => {
                      const eventIndex = events.findIndex((item) => item.id === event.id);
                      return (
                        <motion.path
                          key={event.id}
                          d={event.d}
                          fill="none"
                          stroke={EVENT_COLORS[eventIndex % EVENT_COLORS.length]}
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                          style={{ pathLength: draw }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.16 }}
                          whileInView={{ opacity: 0.24 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.16 + i * 0.05, duration: 0.45 }}
                        />
                      );
                    })}

                    {activeEvent ? (
                      <motion.path
                        key={activeEvent.id}
                        d={activeEvent.d}
                        fill="none"
                        stroke={EVENT_COLORS[events.findIndex((event) => event.id === activeEvent.id) % EVENT_COLORS.length]}
                        strokeWidth="4.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        filter="url(#event-route-glow)"
                        style={{ pathLength: 1 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : null}

                    {cities.map((city, i) => {
                      const event = events.find((item) => item.target === city.key);
                      const isOrigin = city.key === "luxembourg";
                      const isActiveTarget = activeEvent?.target === city.key;
                      return (
                        <g key={city.key}>
                          <motion.circle
                            cx={city.x}
                            cy={city.y}
                            r={isOrigin ? 24 : city.event ? 20 : 12}
                            fill={isOrigin ? "url(#origin-glow)" : "url(#city-glow)"}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: city.event || isOrigin ? 1 : 0.55, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35 + i * 0.025, duration: 0.55 }}
                          />
                          {isActiveTarget ? (
                            <motion.circle
                              cx={city.x}
                              cy={city.y}
                              r={8}
                              fill="none"
                              stroke="rgba(122,167,255,0.8)"
                              strokeWidth="1.2"
                              vectorEffect="non-scaling-stroke"
                              animate={{ scale: [1, 2.4, 2.4], opacity: [0.9, 0, 0] }}
                              transition={{ duration: 2.1, repeat: Infinity, ease: "easeOut" }}
                              style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                            />
                          ) : null}
                          <motion.circle
                            cx={city.x}
                            cy={city.y}
                            r={isActiveTarget ? 4.4 : isOrigin ? 3.8 : city.event ? 3.4 : 2}
                            fill={isOrigin ? "rgba(166,255,203,1)" : city.event ? "rgba(122,167,255,1)" : "rgba(var(--rgb-fg),0.74)"}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.45 + i * 0.025, duration: 0.35 }}
                          />
                          <motion.text
                            x={city.x + 9}
                            y={city.y + 4}
                            fill={isOrigin || isActiveTarget ? "rgba(var(--rgb-fg),0.98)" : "rgba(var(--rgb-fg),0.64)"}
                            fontSize={isOrigin || city.event ? 10.5 : 8.5}
                            fontWeight={isOrigin || city.event ? 650 : 450}
                            letterSpacing="0.03em"
                            initial={{ opacity: 0, x: city.x + 3 }}
                            whileInView={{ opacity: city.event || isOrigin ? 1 : 0.72, x: city.x + 9 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.025, duration: 0.45 }}
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {event ? event.location : city.short}
                          </motion.text>
                        </g>
                      );
                    })}
                  </g>
                </motion.svg>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-bg),0.5)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver)] backdrop-blur-xl sm:left-6 sm:top-6">
                  <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                  Carte événements
                </div>
                <a
                  href={activeEvent?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press absolute bottom-4 right-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-[rgba(var(--rgb-bg),0.62)] px-3 py-1 text-[10px] tracking-[0.05em] text-[var(--color-bone)] backdrop-blur tabular sm:bottom-auto sm:right-6 sm:top-6"
                >
                  <span className="led-live h-[5px] w-[5px] rounded-full bg-[var(--color-signal)]" />
                  {activeEvent?.name ?? "Inscription"}
                </a>
                <div className="absolute bottom-6 left-6 hidden max-w-[calc(100%-3rem)] flex-wrap gap-1.5 sm:flex">
                  {events.map((event, i) => (
                    <span
                      key={event.id}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] tracking-[0.04em] backdrop-blur ${
                        event.id === activeEventId
                          ? "bg-[rgba(122,167,255,0.16)] text-[var(--color-bone)]"
                          : "bg-[rgba(var(--rgb-fg),0.04)] text-[var(--color-silver)]"
                      }`}
                    >
                      <span className="h-[5px] w-[5px] rounded-full" style={{ background: EVENT_COLORS[i % EVENT_COLORS.length] }} />
                      {event.name}
                    </span>
                  ))}
                </div>
              </div>
            </SequenceItem>
          </div>
        </SectionSequence>
      </div>
    </section>
  );
}
