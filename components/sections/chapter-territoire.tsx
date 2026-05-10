"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { territoire, type EventDef, type EventStatus } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { cn } from "@/lib/utils";

/* ── colour per event slot ── */
const EVENT_COLORS = ["#7aa7ff", "#a6ffcb", "#f4f1ea", "#b8c0cc"] as const;

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
  const events = territoire.events as unknown as EventDef[];
  const [drawerEvent, setDrawerEvent] = useState<EventDef | null>(null);

  return (
    <>
      <section id="territoire" aria-labelledby="territoire-title" className="relative">
        <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
          <SectionSequence>
            <SequenceItem>
              <ChapterCard roman="II" title="Territoire" timecode="00:11:42" />
            </SequenceItem>

            <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16">
              {/* ─── Left: title + intro ─── */}
              <div className="col-span-12 lg:col-span-5">
                <RevealTitle
                  id="territoire-title"
                  className="text-grad max-w-[14ch] font-sans font-medium leading-[0.96] sm:max-w-none"
                  style={{ fontSize: "clamp(2.15rem, 7vw, 4.2rem)" }}
                >
                  {territoire.title}
                </RevealTitle>
                <SequenceItem>
                  <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:mt-7 sm:text-[16px]">
                    {territoire.body}
                  </p>
                </SequenceItem>
                <SequenceItem>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[rgba(var(--rgb-fg),0.05)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver)] backdrop-blur">
                    <span className="h-[5px] w-[5px] rounded-full bg-[var(--color-volt)]" />
                    {territoire.eyebrow}
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
        className="absolute left-[11px] top-0 bottom-0 w-[2px] sm:left-[19px] md:left-[27px]"
        style={{ background: "rgba(var(--rgb-fg),0.07)" }}
      />
      {/* ── animated progress ── */}
      <motion.div
        aria-hidden
        className="absolute left-[11px] top-0 w-[2px] sm:left-[19px] md:left-[27px]"
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
            className="fixed inset-0 z-[90] bg-[rgba(0,0,0,0.6)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />

          {/* ── drawer panel ── */}
          <motion.div
            key="drawer-panel"
            className="fixed inset-y-0 right-0 z-[91] w-full max-w-[540px] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative min-h-full border-l border-[rgba(var(--rgb-fg),0.1)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,12,14,0.98) 0%, rgba(5,5,5,0.99) 100%)",
              }}
            >
              {/* top glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[200px]"
                style={{
                  background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${EVENT_COLORS[territoire.events.findIndex((e) => e.id === event.id) % EVENT_COLORS.length]}18, transparent 70%)`,
                }}
              />

              <div className="relative z-[1] p-6 sm:p-8 md:p-10">
                {/* close button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="window-control ml-auto flex"
                  aria-label="Fermer"
                >
                  ✕
                </button>

                {/* event info header */}
                <div className="mt-8">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]"
                    style={{ background: statusCfg.bg, color: statusCfg.color }}
                  >
                    {event.status === "open" && (
                      <span className="led-live inline-block h-[5px] w-[5px] rounded-full bg-[var(--color-signal)]" />
                    )}
                    {statusCfg.label}
                  </span>
                  <h3 className="mt-4 text-3xl font-medium leading-[0.95] text-[var(--color-bone)] sm:text-4xl">
                    {event.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--color-silver-dim)]">
                    <span>{event.date}</span>
                    <span>{event.location}</span>
                    <span className="tabular">{event.distance}</span>
                  </div>
                  <p className="mt-4 max-w-[42ch] text-[14px] leading-[1.65] text-[var(--color-silver)]">
                    {event.description}
                  </p>
                </div>

                {/* divider */}
                <div className="hairline my-8" />

                {/* form or success */}
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      className="flex flex-col items-center gap-4 py-12 text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(52,211,153,0.12)]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.5, type: "spring", stiffness: 200, damping: 12 }}
                      >
                        <span className="text-2xl text-[var(--color-signal)]">✓</span>
                      </motion.div>
                      <h4 className="text-xl font-medium text-[var(--color-bone)]">
                        Demande envoyée
                      </h4>
                      <p className="max-w-[32ch] text-[14px] leading-[1.6] text-[var(--color-silver)]">
                        Votre inscription a été préparée. Nous reviendrons vers vous rapidement.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="press mt-4 rounded-full border border-[rgba(var(--rgb-fg),0.12)] bg-[rgba(var(--rgb-fg),0.04)] px-6 py-2.5 text-[13px] font-medium text-[var(--color-bone)] transition-colors hover:bg-[rgba(var(--rgb-fg),0.08)]"
                      >
                        Fermer
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      className="space-y-6"
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
                        <div className="grid gap-3 sm:grid-cols-2">
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
                            rows={4}
                            className={cn(
                              "w-full resize-none rounded-2xl border px-4 py-3 text-[14px] leading-[1.6] text-[var(--color-bone)] outline-none transition-all duration-300",
                              "border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-fg),0.04)]",
                              "placeholder:text-[var(--color-silver-dim)]",
                              "focus:border-[rgba(122,167,255,0.5)] focus:bg-[rgba(var(--rgb-fg),0.06)] focus:shadow-[0_0_0_3px_rgba(122,167,255,0.1)]",
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
        </>
      ) : null}
    </AnimatePresence>
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
      <span className="mb-2 block text-[11px] uppercase tracking-[0.14em] text-[var(--color-silver-dim)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-volt)]">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={cn(
          "h-12 w-full rounded-2xl border px-4 text-[14px] text-[var(--color-bone)] outline-none transition-all duration-300",
          "border-[rgba(var(--rgb-fg),0.1)] bg-[rgba(var(--rgb-fg),0.04)]",
          "placeholder:text-[var(--color-silver-dim)]",
          "focus:border-[rgba(122,167,255,0.5)] focus:bg-[rgba(var(--rgb-fg),0.06)] focus:shadow-[0_0_0_3px_rgba(122,167,255,0.1)]",
        )}
      />
    </label>
  );
}
