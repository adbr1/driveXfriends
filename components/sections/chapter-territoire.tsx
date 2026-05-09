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
  const draw = useTransform(scrollYProgress, [0.1, 0.68], [0, 1]);

  const { viewBox, countries, roads, cities, events } = data;
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? "");
  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [activeEventId, events],
  );
  const activeIndex = Math.max(0, events.findIndex((event) => event.id === activeEvent?.id));
  const activeColor = EVENT_COLORS[activeIndex % EVENT_COLORS.length];
  const mapFocus = activeEvent?.focus ?? { x: viewBox.w / 2, y: viewBox.h / 2 };
  const mapViewBox = `${mapFocus.x - 135} ${mapFocus.y - 104} 270 208`;

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
                  et Cote d'Azur.
                </p>
              </SequenceItem>

              <SequenceItem>
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                      Prochains evenements
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
                className="relative min-h-[420px] w-full overflow-hidden rounded-[24px] border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.035)] shadow-[0_34px_120px_-70px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:rounded-[36px]"
                style={{ aspectRatio: `${viewBox.w} / ${viewBox.h}` }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 82% 18%, rgba(244,241,234,0.12), transparent 34%), radial-gradient(ellipse at 18% 84%, rgba(122,167,255,0.16), transparent 38%), linear-gradient(135deg, rgba(var(--rgb-fg),0.055), rgba(var(--rgb-bg),0.1) 48%, rgba(var(--rgb-fg),0.035))",
                  }}
                />
                <motion.svg
                  key={activeEvent?.id}
                  viewBox={mapViewBox}
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
                  initial={{ opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                >
                  <defs>
                    <filter id="event-route-glow">
                      <feGaussianBlur stdDeviation="5" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <linearGradient id="route-gradient" x1="12%" y1="82%" x2="86%" y2="22%">
                      <stop offset="0%" stopColor="rgba(122,167,255,0.12)" />
                      <stop offset="42%" stopColor={activeColor} />
                      <stop offset="100%" stopColor="rgba(244,241,234,0.95)" />
                    </linearGradient>
                  </defs>

                  <g>
                    {countries.map((country) => (
                      <path
                        key={country.id}
                        d={country.d}
                        fill={country.isLU ? "rgba(166,255,203,0.18)" : "rgba(var(--rgb-fg),0.045)"}
                        stroke={country.isLU ? "rgba(166,255,203,0.5)" : "rgba(var(--rgb-fg),0.12)"}
                        strokeWidth={country.isLU ? 1.8 : 0.8}
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </g>

                  <g>
                    {roads.map((road) => (
                      <path
                        key={road.id}
                        d={road.d}
                        fill="none"
                        stroke={road.kind === "primary" ? "rgba(var(--rgb-fg),0.18)" : "rgba(var(--rgb-fg),0.09)"}
                        strokeWidth={road.kind === "primary" ? 1.35 : 0.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    ))}
                  </g>

                  <g>
                    <path
                      d={activeEvent?.d ?? ""}
                      fill="none"
                      stroke="rgba(var(--rgb-bg),0.72)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <motion.path
                      d={activeEvent?.d ?? ""}
                      fill="none"
                      stroke="url(#route-gradient)"
                      strokeWidth="4.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#event-route-glow)"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      style={{ pathLength: draw }}
                      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </g>

                  <g>
                    {cities.map((city) => {
                      const isTarget = city.key === activeEvent?.target;
                      const isOrigin = city.key === "luxembourg";
                      return (
                        <g key={city.key}>
                          {isTarget ? (
                            <motion.circle
                              cx={city.x}
                              cy={city.y}
                              r="7"
                              fill="none"
                              stroke={activeColor}
                              strokeOpacity="0.34"
                              strokeWidth="1.4"
                              animate={{ scale: [0.85, 1.7, 0.85], opacity: [0.22, 0.58, 0.22] }}
                              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                              style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                              vectorEffect="non-scaling-stroke"
                            />
                          ) : null}
                          <circle
                            cx={city.x}
                            cy={city.y}
                            r={isOrigin || isTarget ? 3.8 : city.event ? 2.6 : 1.7}
                            fill={isOrigin ? "rgba(166,255,203,1)" : isTarget ? activeColor : "rgba(var(--rgb-fg),0.68)"}
                            stroke="rgba(var(--rgb-bg),0.92)"
                            strokeWidth="1.6"
                            vectorEffect="non-scaling-stroke"
                          />
                          {(isOrigin || isTarget || city.event) ? (
                            <text
                              x={city.x + 7}
                              y={city.y - 5}
                              fill={isOrigin || isTarget ? "rgba(var(--rgb-fg),0.9)" : "rgba(var(--rgb-fg),0.5)"}
                              fontSize="7"
                              fontWeight={isOrigin || isTarget ? 760 : 560}
                              letterSpacing="0"
                              style={{ fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif" }}
                            >
                              {city.short}
                            </text>
                          ) : null}
                        </g>
                      );
                    })}
                  </g>
                </motion.svg>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-bg),0.5)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver)] backdrop-blur-xl sm:left-6 sm:top-6">
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: activeColor }} />
                  Itineraire actif
                </div>
                <div className="absolute left-4 right-4 top-14 max-w-[360px] rounded-3xl border border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-bg),0.46)] p-4 backdrop-blur-xl sm:left-6 sm:right-auto sm:top-16 sm:p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">Destination</p>
                  <p className="mt-2 text-[clamp(1.35rem,3vw,2.45rem)] font-medium leading-[0.98] tracking-[-0.025em] text-[var(--color-bone)]">
                    {activeEvent?.location ?? "Luxembourg"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-[var(--color-silver)]">
                    <span className="rounded-full bg-[rgba(var(--rgb-fg),0.07)] px-3 py-1">{activeEvent?.date}</span>
                    <span className="rounded-full bg-[rgba(var(--rgb-fg),0.07)] px-3 py-1">{activeEvent?.distance}</span>
                  </div>
                </div>
                <a
                  href={activeEvent?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press absolute bottom-4 right-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.92)] px-4 py-2 text-[11px] font-medium tracking-[0.02em] text-[var(--color-ink)] shadow-[0_18px_50px_-24px_rgba(244,241,234,0.72)] backdrop-blur tabular sm:bottom-auto sm:right-6 sm:top-6"
                >
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
