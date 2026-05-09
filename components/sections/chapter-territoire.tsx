"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useMemo, useRef, useState } from "react";
import type { EuropeMapData, EventSpec } from "@/lib/europe-map";
import { territoire } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { cn } from "@/lib/utils";

const EVENT_COLORS = ["#7aa7ff", "#a6ffcb", "#f4f1ea", "#b8c0cc"] as const;

type SignupPayload = {
  eventId: string;
  eventName: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  car: string;
  message: string;
};

export function prepareEventSignupPayload(event: EventSpec, form: HTMLFormElement): SignupPayload {
  const data = new FormData(form);
  return {
    eventId: event.id,
    eventName: event.name,
    eventDate: event.date,
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    phone: String(data.get("phone") ?? ""),
    instagram: String(data.get("instagram") ?? ""),
    car: String(data.get("car") ?? ""),
    message: String(data.get("message") ?? ""),
  };
}

export function ChapterTerritoire({ data }: { data: EuropeMapData }) {
  const { viewBox, countries, cities, events } = data;
  const formRef = useRef<HTMLDivElement>(null);
  const [activeEventId, setActiveEventId] = useState(events[0]?.id ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const activeEvent = useMemo(
    () => events.find((event) => event.id === activeEventId) ?? events[0],
    [activeEventId, events],
  );
  const activeIndex = Math.max(0, events.findIndex((event) => event.id === activeEvent?.id));
  const activeColor = EVENT_COLORS[activeIndex % EVENT_COLORS.length];
  const activeCity = cities.find((city) => city.key === activeEvent?.target) ?? data.origin;

  const selectEvent = (id: string) => {
    setActiveEventId(id);
    setSubmitted(false);
  };

  const openForm = () => {
    setFormOpen(true);
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeEvent) return;
    const payload = prepareEventSignupPayload(activeEvent, event.currentTarget);
    console.info("EmailJS payload ready", payload);
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section id="territoire" aria-labelledby="territoire-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="II" title="Territoire" timecode="00:11:42" />
          </SequenceItem>

          <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
            <div className="col-span-12 lg:col-span-5">
              <RevealTitle
                id="territoire-title"
                className="text-grad max-w-[11ch] font-sans font-medium leading-[0.96] sm:max-w-none"
                style={{ fontSize: "clamp(2.15rem, 7vw, 4.2rem)" }}
              >
                Une carte. Un terrain de jeu.
              </RevealTitle>
              <SequenceItem>
                <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-7 sm:text-[16px]">
                  {territoire.body} Selectionnez un rendez-vous, regardez son point de destination, puis envoyez une
                  demande d'inscription.
                </p>
              </SequenceItem>

              <SequenceItem>
                <div className="mt-8">
                  <div className="mb-3 flex items-center justify-between gap-3 px-1">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                      Prochains evenements
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-silver-dim)]">
                      Inscription
                    </span>
                  </div>
                  <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 sm:mx-0 sm:block sm:overflow-visible sm:px-0">
                    {events.map((event, i) => {
                      const selected = event.id === activeEvent?.id;
                      return (
                        <li key={event.id} className="min-w-[278px] sm:min-w-0">
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => selectEvent(event.id)}
                            className={cn(
                              "press group flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition-colors sm:px-5",
                              selected
                                ? "border-[rgba(122,167,255,0.48)] bg-[rgba(122,167,255,0.14)]"
                                : "border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-fg),0.035)] hover:bg-[rgba(var(--rgb-fg),0.06)]",
                              i > 0 && "sm:mt-2",
                            )}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold tabular text-[var(--color-ink)]"
                                style={{ background: EVENT_COLORS[i % EVENT_COLORS.length] }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-[14px] font-medium text-[var(--color-bone)] sm:text-[15px]">
                                  {event.name}
                                </span>
                                <span className="mt-1 block truncate text-[11px] text-[var(--color-silver-dim)]">
                                  {event.date} - {event.location}
                                </span>
                              </span>
                            </span>
                            <span className="shrink-0 text-[11px] text-[var(--color-silver-dim)] tabular">
                              {event.distance}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </SequenceItem>
            </div>

            <SequenceItem className="col-span-12 lg:col-span-7">
              <div className="relative overflow-hidden rounded-[26px] border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.035)] p-4 shadow-[0_34px_120px_-70px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:rounded-[34px] sm:p-6">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at 78% 18%, rgba(244,241,234,0.1), transparent 34%), radial-gradient(ellipse at 18% 84%, rgba(122,167,255,0.16), transparent 42%), linear-gradient(135deg, rgba(var(--rgb-fg),0.045), rgba(var(--rgb-bg),0.18) 52%, rgba(var(--rgb-fg),0.025))",
                  }}
                />
                <div className="relative z-[1] flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-bg),0.66)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-silver)] backdrop-blur">
                    <span className="h-[5px] w-[5px] rounded-full" style={{ background: activeColor }} />
                    Point actif
                  </span>
                  <button
                    type="button"
                    onClick={openForm}
                    className="press rounded-full bg-[var(--color-bone)] px-4 py-2 text-[12px] font-medium text-[var(--color-ink)]"
                  >
                    S'inscrire
                  </button>
                </div>

                <div className="relative z-[1] mt-5 grid gap-5">
                  <div className="relative min-h-[480px] overflow-hidden rounded-[22px] border border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-bg),0.34)] sm:min-h-[600px]">
                    <svg
                      viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
                      className="absolute inset-0 h-full w-full"
                      preserveAspectRatio="xMidYMid meet"
                      aria-hidden
                    >
                      <motion.g
                        animate={{
                          x: viewBox.w / 2 - (activeEvent?.focus.x ?? viewBox.w / 2),
                          y: viewBox.h / 2 - (activeEvent?.focus.y ?? viewBox.h / 2),
                          scale: activeEvent?.focus.scale ?? 2.2,
                        }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        style={{ transformOrigin: `${activeEvent?.focus.x ?? viewBox.w / 2}px ${activeEvent?.focus.y ?? viewBox.h / 2}px` }}
                      >
                        {countries.map((country) => (
                          <path
                            key={country.id}
                            d={country.d}
                            fill={country.isLU ? "rgba(166,255,203,0.22)" : "rgba(var(--rgb-fg),0.11)"}
                            stroke={country.isLU ? "rgba(166,255,203,0.7)" : "rgba(var(--rgb-fg),0.28)"}
                            strokeWidth={country.isLU ? 3 : 1.6}
                            vectorEffect="non-scaling-stroke"
                          />
                        ))}
                        {events.map((event, i) => {
                          const city = cities.find((item) => item.key === event.target);
                          if (!city) return null;
                          const selected = event.id === activeEvent?.id;
                          return (
                            <g key={event.id}>
                              <motion.circle
                                cx={city.x}
                                cy={city.y}
                                r={selected ? 18 : 10}
                                fill={EVENT_COLORS[i % EVENT_COLORS.length]}
                                opacity={selected ? 0.25 : 0.1}
                                animate={selected ? { scale: [0.8, 1.4, 0.8] } : { scale: 1 }}
                                transition={{ duration: 2.4, repeat: selected ? Infinity : 0, ease: "easeInOut" }}
                                style={{ transformOrigin: `${city.x}px ${city.y}px` }}
                              />
                              <circle
                                cx={city.x}
                                cy={city.y}
                                r={selected ? 8 : 5}
                                fill={EVENT_COLORS[i % EVENT_COLORS.length]}
                                stroke="rgba(var(--rgb-bg),0.95)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                              />
                              {selected && (
                                <text
                                  x={city.x}
                                  y={city.y - 24}
                                  textAnchor="middle"
                                  fill="var(--color-bone)"
                                  fontSize="11"
                                  fontWeight="600"
                                  fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                                  letterSpacing="0.04em"
                                >
                                  {event.name}
                                </text>
                              )}
                            </g>
                          );
                        })}
                        {/* Route line for active event */}
                        {activeEvent?.d && (
                          <motion.path
                            key={activeEvent.id + "-route"}
                            d={activeEvent.d}
                            fill="none"
                            stroke={activeColor}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="6 4"
                            vectorEffect="non-scaling-stroke"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.7 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          />
                        )}
                      </motion.g>
                    </svg>
                    <motion.div
                      key={activeEvent?.id}
                      className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)] rounded-full border border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-bg),0.72)] px-4 py-2 text-[12px] font-medium text-[var(--color-bone)] backdrop-blur-xl"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {activeEvent?.location} · {activeEvent?.date}
                    </motion.div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-[22px] border border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-bg),0.42)] p-5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-dim)]">
                        Evenement selectionne
                      </p>
                      <h3 className="mt-3 text-2xl font-medium leading-tight text-[var(--color-bone)]">
                        {activeEvent?.name}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--color-silver)]">
                        Un point de rendez-vous, une destination, et une demande d'inscription qui partira bientot via
                        EmailJS.
                      </p>
                    </div>
                    <div className="flex items-end rounded-[22px] border border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-bg),0.42)] p-5">
                      <button
                        type="button"
                        onClick={openForm}
                        className="press inline-flex h-11 w-full items-center justify-center rounded-full bg-[var(--color-bone)] px-5 text-[13px] font-medium text-[var(--color-ink)]"
                      >
                        Ouvrir le formulaire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SequenceItem>
          </div>

          <SequenceItem className="mt-6 pb-[clamp(6rem,14vh,10rem)] lg:mt-8" ref={formRef}>
            <AnimatePresence initial={false}>
              {formOpen ? (
                <motion.div
                  key={activeEvent?.id}
                  className="relative overflow-hidden rounded-[26px] border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.045)] p-4 shadow-[0_28px_100px_-70px_rgba(0,0,0,0.95)] backdrop-blur-xl sm:rounded-[34px] sm:p-6 lg:p-8"
                  initial={{ opacity: 0, y: 28, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.99 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver)]">
                        Demande d'inscription
                      </p>
                      <h3 className="mt-3 max-w-[12ch] text-3xl font-medium leading-[0.95] text-[var(--color-bone)] sm:text-5xl">
                        {activeEvent?.name}
                      </h3>
                      <p className="mt-4 max-w-[38ch] text-sm leading-6 text-[var(--color-silver)]">
                        L'envoi EmailJS sera branche ici. Pour l'instant, le formulaire prepare deja un payload stable
                        avec l'evenement choisi.
                      </p>
                    </div>

                    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
                      <Field name="name" label="Nom" required />
                      <Field name="email" label="Email" type="email" required />
                      <Field name="phone" label="Telephone" />
                      <Field name="instagram" label="Instagram" />
                      <Field name="car" label="Voiture" className="sm:col-span-2" required />
                      <label className="sm:col-span-2">
                        <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-[var(--color-silver-dim)]">
                          Message
                        </span>
                        <textarea
                          name="message"
                          rows={4}
                          className="w-full resize-none rounded-2xl border border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-bg),0.46)] px-4 py-3 text-sm text-[var(--color-bone)] outline-none transition-colors placeholder:text-[var(--color-silver-dim)] focus:border-[rgba(122,167,255,0.7)]"
                          placeholder="Votre disponibilite, passager, details utiles..."
                        />
                      </label>
                      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
                        <button
                          type="submit"
                          className="press inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-bone)] px-6 text-[13px] font-medium text-[var(--color-ink)]"
                        >
                          Envoyer la demande
                        </button>
                        {submitted ? (
                          <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-[var(--color-signal)]"
                          >
                            Demande preparee. EmailJS pourra reprendre ce payload.
                          </motion.p>
                        ) : null}
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </SequenceItem>
        </SectionSequence>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-[var(--color-silver-dim)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full rounded-2xl border border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-bg),0.46)] px-4 text-sm text-[var(--color-bone)] outline-none transition-colors placeholder:text-[var(--color-silver-dim)] focus:border-[rgba(122,167,255,0.7)]"
      />
    </label>
  );
}
