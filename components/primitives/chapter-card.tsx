import { cn } from "@/lib/utils";

type Props = {
  roman: string;
  title: string;
  timecode: string;
  className?: string;
};

export function ChapterCard({ roman, title, className }: Props) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="flex items-baseline gap-4 text-[var(--color-silver-dim)]">
        <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-[var(--color-silver)]">
          Chapitre {roman}
        </span>
        <span aria-hidden className="hairline max-w-[64px] flex-1 self-center" />
        <span className="text-[11px] font-medium tracking-[0.04em] text-[var(--color-bone)]">
          {title}
        </span>
      </div>
    </div>
  );
}
