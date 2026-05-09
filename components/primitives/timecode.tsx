import { cn } from "@/lib/utils";

type Props = {
  value: string;
  prefix?: string;
  className?: string;
};

export function Timecode({ value, prefix, className }: Props) {
  return (
    <span className={cn("font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver-dim)] tabular", className)}>
      {prefix ? <span className="opacity-60 mr-2">{prefix}</span> : null}
      {value}
    </span>
  );
}
