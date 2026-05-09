import { footerText, brand } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-[1440px] px-[var(--gutter)] py-10">
        <div className="flex flex-col gap-6 border-t border-[rgba(184,192,204,0.12)] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-bone)]">
              {footerText.line1}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver-dim)]">
              {footerText.line2}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-silver-dim)]">
            <a
              className="transition-colors hover:text-[var(--color-bone)]"
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Drive x Friends"
            >
              IG · @{brand.instagram}
            </a>
            <a
              className="transition-colors hover:text-[var(--color-bone)]"
              href={`mailto:${brand.email}`}
              aria-label="Email Drive x Friends"
            >
              {brand.email}
            </a>
            <span aria-hidden>#DriveXFriends</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
