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

type RoutePoint = {
  x: number;
  y: number;
};

export function ChapterTerritoire({ data }: { data: EuropeMapData }) {
  const ref = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const draw = useTransform(scrollYProgress, [0.1, 0.68], [0, 1]);

  const { viewBox, events } = data;
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? "");
  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [activeEventId, events],
  );
  const activeIndex = Math.max(0, events.findIndex((event) => event.id === activeEvent?.id));
  const activeColor = EVENT_COLORS[activeIndex % EVENT_COLORS.length];
  const routePoints = useMemo(
    () => buildRoutePoints(activeEvent?.waypoints.length ?? 4, activeEvent?.distance === "local"),
    [activeEvent],
  );
  const routeD = useMemo(() => buildRoutePath(routePoints), [routePoints]);
  const stopLabels = useMemo(
    () => buildStopLabels(activeEvent?.location ?? "Destination", routePoints.length),
    [activeEvent, routePoints.length],
  );

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
                <div aria-hidden className="absolute inset-x-8 top-20 h-px bg-[linear-gradient(90deg,transparent,rgba(var(--rgb-fg),0.18),transparent)]" />
                <div aria-hidden className="absolute bottom-8 left-8 right-8 h-px bg-[linear-gradient(90deg,transparent,rgba(var(--rgb-fg),0.14),transparent)]" />
                <motion.div
                  aria-hidden
                  className="absolute -right-[10%] top-[18%] h-[48%] w-[58%] rounded-full border border-[rgba(var(--rgb-fg),0.08)]"
                  animate={{ rotate: [0, 2.5, 0], scale: [1, 1.025, 1] }}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: "radial-gradient(ellipse at 50% 50%, rgba(var(--rgb-fg),0.055), transparent 62%)",
                  }}
                />

                <motion.svg
                  viewBox="0 0 1000 640"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                  aria-hidden
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
                    <path
                      d={routeD}
                      fill="none"
                      stroke="rgba(var(--rgb-fg),0.09)"
                      strokeWidth="34"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <motion.path
                      d={routeD}
                      fill="none"
                      stroke="rgba(var(--rgb-fg),0.18)"
                      strokeWidth="2"
                      strokeDasharray="10 16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ pathLength: draw }}
                    />
                    <motion.path
                      key={activeEvent?.id}
                      d={routeD}
                      fill="none"
                      stroke="url(#route-gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#event-route-glow)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                    />

                    {routePoints.map((point, i) => {
                      const isFirst = i === 0;
                      const isLast = i === routePoints.length - 1;
                      return (
                        <g key={`${point.x}-${point.y}-${i}`}>
                          {isLast ? (
                            <motion.circle
                              cx={point.x}
                              cy={point.y}
                              r="34"
                              fill="none"
                              stroke={activeColor}
                              strokeOpacity="0.22"
                              strokeWidth="2"
                              animate={{ scale: [0.84, 1.22, 0.84], opacity: [0.18, 0.5, 0.18] }}
                              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                              style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                            />
                          ) : null}
                          <motion.circle
                            cx={point.x}
                            cy={point.y}
                            r={isFirst || isLast ? 16 : 10}
                            fill={isFirst ? "rgba(166,255,203,1)" : isLast ? activeColor : "rgba(var(--rgb-fg),0.72)"}
                            stroke="rgba(var(--rgb-bg),0.9)"
                            strokeWidth="5"
                            initial={{ opacity: 0, scale: 0.6 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.12 + i * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                          />
                          <motion.text
                            x={point.x}
                            y={point.y + (isLast ? 46 : -28)}
                            fill={isFirst || isLast ? "rgba(var(--rgb-fg),0.94)" : "rgba(var(--rgb-fg),0.5)"}
                            fontSize={isFirst || isLast ? 20 : 14}
                            fontWeight={isFirst || isLast ? 760 : 560}
                            textAnchor="middle"
                            letterSpacing="0.02em"
                            initial={{ opacity: 0, y: point.y + (isLast ? 36 : -18) }}
                            whileInView={{ opacity: 1, y: point.y + (isLast ? 46 : -28) }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.22 + i * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {stopLabels[i]}
                          </motion.text>
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

function buildRoutePoints(count: number, local: boolean): RoutePoint[] {
  if (local) {
    return [
      { x: 205, y: 420 },
      { x: 410, y: 310 },
      { x: 615, y: 405 },
      { x: 790, y: 305 },
    ];
  }

  const base = [
    { x: 140, y: 470 },
    { x: 325, y: 390 },
    { x: 510, y: 280 },
    { x: 690, y: 210 },
    { x: 850, y: 295 },
  ];

  return base.slice(0, Math.max(3, Math.min(count, base.length)));
}

function buildRoutePath(points: RoutePoint[]) {
  if (points.length < 2) return "";

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const prev = points[index - 1];
    const cx = (prev.x + point.x) / 2;
    const cy = Math.min(prev.y, point.y) - 56 + index * 8;
    return `${path} Q ${cx} ${cy} ${point.x} ${point.y}`;
  }, "");
}

function buildStopLabels(destination: string, count: number) {
  const labels = ["Luxembourg", "Pause", "Route", "Arrivee"];
  const cleanDestination = destination.split("/")[0]?.trim() || "Destination";

  if (count <= 3) return ["Luxembourg", "Route", cleanDestination];

  return Array.from({ length: count }, (_, i) => {
    if (i === 0) return "Luxembourg";
    if (i === count - 1) return cleanDestination;
    return labels[i] ?? "Route";
  });
}
