import { LightStreaks } from "@/components/decor/light-streaks";
import { Nav } from "@/components/sections/nav";
import { ChapterPrologue } from "@/components/sections/chapter-prologue";
import { Interstitial } from "@/components/sections/interstitial";
import { ChapterTerritoire } from "@/components/sections/chapter-territoire";
import { getEuropeMapData } from "@/lib/europe-map";
import { ChapterExperiences } from "@/components/sections/chapter-experiences";
import { Marquee } from "@/components/sections/marquee";
import { ChapterMoments } from "@/components/sections/chapter-moments";
import { ChapterInvitation } from "@/components/sections/chapter-invitation";
import { ChapterContact } from "@/components/sections/chapter-contact";
import { ChapterBoutique } from "@/components/sections/chapter-boutique";
import { Coda } from "@/components/sections/coda";
import { SiteFooter } from "@/components/sections/footer";

export default function Home() {
  const europeData = getEuropeMapData();
  return (
    <>
      <Nav />
      <LightStreaks />
      <main id="main" className="relative z-[2]">
        <ChapterPrologue />

        <Interstitial
          roman="II"
          eyebrow="Territoire"
          title="La saison se trace."
          subtitle="Monaco, Forêt-Noire, Luxembourg : les prochains événements deviennent des points de fuite."
        />
        <ChapterTerritoire data={europeData} />

        <Interstitial
          roman="III"
          eyebrow="Expériences"
          title="Quatre tableaux."
          subtitle="Balades, rencontres, cafés du dimanche, soirées privées — quatre façons d'écrire la même histoire."
        />
        <ChapterExperiences />

        <Marquee />

        <ChapterMoments />

        <Interstitial
          roman="V"
          eyebrow="Invitation"
          title="L'entrée se mérite."
          subtitle="Un pass numéroté, une saison, une communauté."
        />
        <ChapterInvitation />

        <ChapterContact />

        <ChapterBoutique />

        <Coda />
      </main>
      <SiteFooter />
    </>
  );
}
