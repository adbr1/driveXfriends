import { experiences } from "@/lib/content";
import { ChapterCard } from "@/components/primitives/chapter-card";
import { RevealTitle, SectionSequence, SequenceItem } from "@/components/primitives/section-sequence";
import { ExperienceCard } from "./experience-card";

export function ChapterExperiences() {
  return (
    <section id="experiences" aria-labelledby="experiences-title" className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] pt-[clamp(4rem,10vh,8rem)]">
        <SectionSequence>
          <SequenceItem>
            <ChapterCard roman="III" title="Expériences" timecode="00:27:08" />
          </SequenceItem>

          <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-8 md:mt-16 md:gap-y-12">
            <div className="col-span-12 md:col-span-7">
              <RevealTitle
                id="experiences-title"
                className="text-grad font-sans font-medium leading-[0.96] tracking-[-0.025em]"
                style={{ fontSize: "clamp(2.25rem, 10vw, 5rem)" }}
              >
                Quatre façons <span className="text-[var(--color-silver-dim)]">de vivre la route.</span>
              </RevealTitle>
            </div>
            <SequenceItem className="col-span-12 md:col-span-5 md:pt-6">
              <p className="max-w-[44ch] text-[15px] leading-[1.65] text-[var(--color-silver)] sm:text-[17px]">
                Drive x Friends construit chaque rencontre comme une pièce de mise en scène : le lieu,
                la lumière, la durée, le rythme. Aucune n'est jamais identique.
              </p>
            </SequenceItem>
          </div>

          <SequenceItem className="mt-12 grid grid-cols-1 gap-4 pb-[clamp(6rem,14vh,10rem)] sm:mt-16 md:mt-20 md:grid-cols-2 md:gap-6">
            {experiences.map((e, i) => (
              <ExperienceCard
                key={e.id}
                index={i}
                label={e.label}
                title={e.title}
                body={e.body}
                image={e.image}
              />
            ))}
          </SequenceItem>
        </SectionSequence>
      </div>
    </section>
  );
}
