"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { saison, type EventDef, type EventStatus } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { cn } from "@/lib/utils";

/* ── colour per event slot ── */
const EVENT_COLORS = ["#7aa7ff", "#a6ffcb", "#f4f1ea", "#b8c0cc"] as const;

/* ── timeline rail position (single source of truth, prevents hydration drift) ── */
const RAIL_LEFT = "left-[11px] sm:left-[13px] md:left-[15px]";

/* ── status badge config ── */
const STATUS_CONFIG: Record<EventStatus, { label: string; color: string; bg: string }> = {
  open: {
    label: "Inscriptions ouvertes",
    color: "var(--color-signal)",
    bg: "rgba(52,211,153,0.12)",
  },
  soon: {
    label: "Bientôt",
    color: "var(--color-silver)",
    bg: "rgba(var(--rgb-fg),0.06)",
  },
  tbc: {
    label: "À confirmer",
    color: "var(--color-silver-dim)",
    bg: "rgba(var(--rgb-fg),0.04)",
  },
};

/* ── signup payload (kept for future EmailJS integration) ── */
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

function prepareSignupPayload(event: EventDef, form: HTMLFormElement): SignupPayload {
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

/* ═══════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════ */

export function ChapterTerritoire() {
  const events = saison.events as unknown as EventDef[];
  const [drawerEvent, setDrawerEvent] = useState<EventDef | null>(null);

  return (
    <>
      <section id="saison" aria-labelledby="saison-title" className="relative">
        <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
          <SectionSequence>
            <SequenceItem>
              <ChapterCard roman="II" title="Saison" timecode="00:11:42" />
            </SequenceItem>

            <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
              {/* ─── Left: title + intro ─── */}
              <div className="col-span-12 lg:col-span-5">
                <RevealTitle
                  id="saison-title"
                  className="text-grad max-w-[14ch] font-sans font-medium leading-[0.96] sm:max-w-none"
                  style={{ fontSize: "clamp(2.15rem, 7vw, 4.2rem)" }}
                >
                  Le road book <span className="text-[var(--color-silver-dim)]">de la saison.</span>
                </RevealTitle>
                <SequenceItem>
                  <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-7 sm:text-[16px]">
                    {saison.body}
                  </p>
                </SequenceItem>
                <SequenceItem>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.05)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver)] backdrop-blur">
                    <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                    {saison.eyebrow}
                  </div>
                </SequenceItem>
              </div>

              {/* ─── Right: vertical timeline ─── */}
              <div className="col-span-12 lg:col-span-7">
                <Timeline events={events} onSignup={setDrawerEvent} />
              </div>
            </div>
          </SectionSequence>
        </div>

        {/* bottom padding */}
        <div className="h-[clamp(6rem,14vh,10rem)]" />
      </section>

      {/* ─── Registration drawer ─── */}
      <SignupDrawer event={drawerEvent} onClose={() => setDrawerEvent(null)} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE
   ═══════════════════════════════════════════════ */

function Timeline({ events, onSignup }: { events: EventDef[]; onSignup: (e: EventDef) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 55%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative pl-8 sm:pl-12 md:pl-16">
      {/* ── vertical rail ── */}
      <div
        aria-hidden
        className={cn("absolute top-0 bottom-0 w-[2px]", RAIL_LEFT)}
        style={{ background: "rgba(var(--rgb-fg),0.07)" }}
      />
      {/* ── animated progress ── */}
      <motion.div
        aria-hidden
        className={cn("absolute top-0 w-[2px]", RAIL_LEFT)}
        style={{
          height: lineHeight,
          background: "linear-gradient(180deg, #7aa7ff 0%, #a6ffcb 60%, rgba(var(--rgb-fg),0.12) 100%)",
          boxShadow: "0 0 18px rgba(122,167,255,0.35)",
        }}
      />

      {/* ── event cards ── */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {events.map((event, i) => (
          <TimelineCard
            key={event.id}
            event={event}
            index={i}
            color={EVENT_COLORS[i % EVENT_COLORS.length]}
            onSignup={() => onSignup(event)}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TIMELINE CARD
   ═══════════════════════════════════════════════ */

function TimelineCard({
  event,
  index,
  color,
  onSignup,
}: {
  event: EventDef;
  index: number;
  color: string;
  onSignup: () => void;
}) {
  const status = STATUS_CONFIG[event.status];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── dot on the rail ── */}
      <div
        className="absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold sm:-left-12 sm:h-7 sm:w-7 sm:text-[10px] md:-left-16 md:h-8 md:w-8"
        style={{
          background: color,
          color: "var(--color-ink)",
          boxShadow: `0 0 24px ${color}44, 0 0 0 4px rgba(5,5,5,1)`,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* ── card ── */}
      <div
        className={cn(
          "group relative overflow-hidden rounded-[20px] border p-5 sm:rounded-[24px] sm:p-6",
          "border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-fg),0.03)]",
          "transition-all duration-500",
          "hover:border-[rgba(var(--rgb-fg),0.18)] hover:bg-[rgba(var(--rgb-fg),0.055)]",
        )}
      >
        {/* glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-[24px]"
          style={{
            background: `radial-gradient(600px circle at 50% 0%, ${color}11, transparent 60%)`,
          }}
        />

        {/* gradient hairline border */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[20px] sm:rounded-[24px]"
          style={{
            padding: "1px",
            background: `linear-gradient(140deg, ${color}55, rgba(var(--rgb-fg),0.04) 30%, rgba(var(--rgb-fg),0.02) 70%, ${color}33)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="relative z-[1]">
          {/* header row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className="text-[20px] font-medium leading-tight text-[var(--color-bone)] sm:text-[22px]"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--color-bone) 60%, ${color})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {event.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--color-silver-dim)]">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="text-[10px]">◆</span>
                  {event.date}
                </span>
                <span>{event.location}</span>
                <span className="tabular">{event.distance}</span>
              </div>
            </div>

            {/* status badge */}
            <span
              className="shrink-0 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
              style={{ background: status.bg, color: status.color }}
            >
              {event.status === "open" && (
                <span className="mr-1.5 inline-block h-[5px] w-[5px] animate-pulse rounded-full bg-[var(--color-signal)]" />
              )}
              {status.label}
            </span>
          </div>

          {/* description */}
          <p className="mt-4 max-w-[54ch] text-[14px] leading-[1.65] text-[var(--color-silver)]">
            {event.description}
          </p>

          {/* CTA */}
          <div className="mt-5 flex items-center gap-4">
            <button
              type="button"
              onClick={onSignup}
              className={cn(
                "press group/btn inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12px] font-medium transition-all duration-300",
                event.status === "open"
                  ? "bg-[var(--color-bone)] text-[var(--color-ink)] shadow-[0_6px_24px_-8px_rgba(var(--rgb-fg),0.4)] hover:shadow-[0_12px_36px_-8px_rgba(var(--rgb-fg),0.55)]"
                  : "border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.04)] text-[var(--color-bone)] hover:bg-[rgba(var(--rgb-fg),0.08)]",
              )}
            >
              {event.status === "tbc" ? "Me notifier" : "S'inscrire"}
              <span
                aria-hidden
                className="inline-block translate-x-0 transition-transform duration-300 group-hover/btn:translate-x-0.5"
              >
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SIGNUP DRAWER (slide-in panel)
   ═══════════════════════════════════════════════ */

function SignupDrawer({ event, onClose }: { event: EventDef | null; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const isOpen = event !== null;

  // Reset submitted state when switching events
  useEffect(() => {
    setSubmitted(false);
  }, [event?.id]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    const payload = prepareSignupPayload(event, e.currentTarget);
    console.info("EmailJS payload ready", payload);
    setSubmitted(true);
    e.currentTarget.reset();
  };

  const statusCfg = event ? STATUS_CONFIG[event.status] : STATUS_CONFIG.open;

  return (
    <AnimatePresence>
      {isOpen && event ? (
        <>
          {/* ── backdrop ── */}
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.65)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />

          {/* ── modal panel (centered) ── */}
          <motion.div
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Inscription ${event.name}`}
            className="fixed inset-0 z-[91] flex items-center justify-center px-3 pb-3 pt-[6.5rem] sm:px-6 sm:pb-6 sm:pt-[7.5rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative flex w-full max-w-[640px] max-h-[calc(100svh-8rem)] flex-col overflow-hidden rounded-[24px] border border-[rgba(var(--rgb-fg),0.12)] shadow-[0_40px_140px_-60px_rgba(0,0,0,0.95)] sm:max-h-[calc(100svh-9.5rem)] sm:rounded-[32px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,12,14,0.98) 0%, rgba(5,5,5,0.99) 100%)",
              }}
              initial={{ y: 40, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* top glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[220px]"
                style={{
                  background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${EVENT_COLORS[saison.events.findIndex((e) => e.id === event.id) % EVENT_COLORS.length]}1f, transparent 70%)`,
                }}
              />

              {/* sticky header */}
              <div className="relative z-[2] flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[rgba(var(--rgb-fg),0.08)] bg-[rgba(var(--rgb-bg),0.6)] px-5 backdrop-blur-xl sm:h-[68px] sm:px-7">
                <h3 className="min-w-0 truncate text-[17px] font-medium leading-none text-[var(--color-bone)] sm:text-[18px]">
                  {event.name}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="press flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(var(--rgb-fg),0.14)] bg-[rgba(var(--rgb-fg),0.04)] text-[18px] text-[var(--color-bone)] transition-colors hover:bg-[rgba(var(--rgb-fg),0.1)]"
                  aria-label="Fermer"
                >
                  ×
                </button>
              </div>

              {/* scrollable body */}
              <div className="relative z-[1] flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
                <div className="px-6 pt-7 pb-[calc(env(safe-area-inset-bottom)+1.75rem)] sm:px-8 sm:pt-8 sm:pb-8 md:px-10 md:pb-10">
                  {/* event info */}
                  <div>
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {event.status === "open" && (
                        <span className="led-live inline-block h-[5px] w-[5px] rounded-full bg-[var(--color-signal)]" />
                      )}
                      {statusCfg.label}
                    </span>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--color-silver-dim)]">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                      <span className="tabular">{event.distance}</span>
                    </div>
                    <p className="mt-3 max-w-[52ch] text-[14px] leading-[1.65] text-[var(--color-silver)]">
                      {event.description}
                    </p>
                  </div>

                  {/* divider */}
                  <div className="hairline my-7" />

                  {/* form or success */}
                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <SuccessSplash key="success" onClose={onClose} />
                    ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      className="space-y-8"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Group: You */}
                      <fieldset>
                        <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                          Vous
                        </legend>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <DrawerField name="name" label="Nom" placeholder="Alexandre Dupont" required />
                          <DrawerField name="email" label="Email" type="email" placeholder="alex@exemple.com" required />
                          <DrawerField name="phone" label="Téléphone" placeholder="+352 ..." />
                          <DrawerField name="instagram" label="Instagram" placeholder="@votre_handle" />
                        </div>
                      </fieldset>

                      {/* Group: Car */}
                      <fieldset>
                        <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                          Votre voiture
                        </legend>
                        <DrawerField
                          name="car"
                          label="Modèle"
                          placeholder="Porsche 911 GT3, BMW M3 E46..."
                          required
                        />
                      </fieldset>

                      {/* Group: Message */}
                      <fieldset>
                        <legend className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-silver)]">
                          Message
                        </legend>
                        <label>
                          <span className="sr-only">Message</span>
                          <textarea
                            name="message"
                            style={{ caretColor: "var(--color-volt)", colorScheme: "dark" }}
                            className={cn(
                              "min-h-[120px] w-full resize-y rounded-2xl border px-4 py-3 text-[15px] leading-[1.65] text-[var(--color-bone)] outline-none transition-all duration-200",
                              "border-[rgba(var(--rgb-fg),0.14)] bg-[rgba(255,255,255,0.025)] backdrop-blur-sm",
                              "placeholder:text-[rgba(var(--rgb-fg),0.32)]",
                              "hover:border-[rgba(var(--rgb-fg),0.22)]",
                              "focus:border-[rgba(122,167,255,0.7)] focus:bg-[rgba(255,255,255,0.045)] focus:shadow-[0_0_0_4px_rgba(122,167,255,0.14)]",
                            )}
                            placeholder="Disponibilité, passager, détails utiles..."
                          />
                        </label>
                      </fieldset>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="press inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-bone)] px-6 text-[13px] font-medium text-[var(--color-ink)] shadow-[0_8px_30px_-10px_rgba(var(--rgb-fg),0.45)] transition-shadow duration-300 hover:shadow-[0_18px_50px_-12px_rgba(var(--rgb-fg),0.6)]"
                      >
                        Envoyer la demande
                        <span aria-hidden>→</span>
                      </button>
                    </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS SPLASH (wow animation)
   ═══════════════════════════════════════════════ */

const PARTICLE_COUNT = 18;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 90 + Math.random() * 60;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    color: i % 3 === 0 ? "#a6ffcb" : i % 3 === 1 ? "#7aa7ff" : "#f4f1ea",
    size: 4 + Math.random() * 4,
    delay: 0.18 + Math.random() * 0.12,
  };
});

function SuccessSplash({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      aria-live="polite"
      className="relative flex flex-col items-center gap-5 py-10 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
    >
      {/* particle burst */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58px] h-0 w-0">
        {PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 12px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.4],
            }}
            transition={{
              delay: p.delay,
              duration: 1.1,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.2, 0.7, 1],
            }}
          />
        ))}
      </div>

      {/* concentric rings */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58px] h-0 w-0">
        {[0, 0.12, 0.24].map((delay, i) => (
          <motion.span
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border"
            style={{ borderColor: "rgba(166,255,203,0.4)" }}
            initial={{ width: 60, height: 60, opacity: 0.6 }}
            animate={{ width: 220, height: 220, opacity: 0 }}
            transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      {/* check medallion */}
      <motion.div
        className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(166,255,203,0.22), rgba(166,255,203,0.05) 70%)",
          boxShadow:
            "0 0 0 1px rgba(166,255,203,0.35), 0 20px 60px -10px rgba(166,255,203,0.35)",
        }}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.05 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
          <motion.path
            d="M10 20.5 L17.5 28 L31 13"
            stroke="#a6ffcb"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.32, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: "drop-shadow(0 0 6px rgba(166,255,203,0.6))" }}
          />
        </svg>
      </motion.div>

      <motion.h4
        className="text-2xl font-medium text-[var(--color-bone)] sm:text-3xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        Demande envoyée
      </motion.h4>
      <motion.p
        className="max-w-[34ch] text-[14px] leading-[1.6] text-[var(--color-silver)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        Votre inscription a été préparée. Nous reviendrons vers vous très rapidement.
      </motion.p>
      <motion.button
        type="button"
        onClick={onClose}
        className="press mt-3 rounded-full border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.04)] px-6 py-2.5 text-[13px] font-medium text-[var(--color-bone)] transition-colors hover:bg-[rgba(var(--rgb-fg),0.08)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
      >
        Fermer
      </motion.button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   DRAWER FIELD
   ═══════════════════════════════════════════════ */

function DrawerField({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-2 text-[12px] font-medium tracking-[0.02em] text-[var(--color-silver)]">
        <span>{label}</span>
        {!required && (
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-silver-dim)]">
            Optionnel
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        style={{ caretColor: "var(--color-volt)", colorScheme: "dark" }}
        className={cn(
          "h-[52px] w-full rounded-2xl border px-4 text-[15px] text-[var(--color-bone)] outline-none transition-all duration-200",
          "border-[rgba(var(--rgb-fg),0.14)] bg-[rgba(255,255,255,0.025)] backdrop-blur-sm",
          "placeholder:text-[rgba(var(--rgb-fg),0.32)]",
          "hover:border-[rgba(var(--rgb-fg),0.22)]",
          "focus:border-[rgba(122,167,255,0.7)] focus:bg-[rgba(255,255,255,0.045)] focus:shadow-[0_0_0_4px_rgba(122,167,255,0.14)]",
        )}
      />
    </label>
  );
}
