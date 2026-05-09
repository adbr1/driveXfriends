import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex select-none flex-col font-sans font-black uppercase leading-[0.78] tracking-[-0.08em]",
        compact ? "text-[18px]" : "text-[clamp(3.2rem,12vw,8rem)]",
        className,
      )}
    >
      <span className="whitespace-nowrap">
        DRIVE <span className="tracking-[-0.05em]">X</span>
      </span>
      <span className="whitespace-nowrap">FRIENDS</span>
    </span>
  );
}
