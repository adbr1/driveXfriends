import type { Metadata } from "next";
import { Nav } from "@/components/sections/nav";
import { SiteFooter } from "@/components/sections/footer";
import { shop, brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Boutique - Drive x Friends",
  description: "Lookbook de precommande Drive x Friends : pieces de club, vetements et accessoires.",
};

export default function BoutiquePage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative z-[2] min-h-screen overflow-hidden pt-28 sm:pt-36">
        <section className="mx-auto max-w-[1440px] px-[var(--gutter)] pb-[clamp(5rem,12vh,9rem)]">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="inline-flex rounded-full bg-[rgba(var(--rgb-fg),0.06)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--color-silver)]">
                {shop.eyebrow}
              </p>
              <h1 className="text-grad mt-6 max-w-[9ch] text-[clamp(3.2rem,10vw,8rem)] font-black uppercase leading-[0.84]">
                {shop.title}
              </h1>
            </div>
            <p className="max-w-[48ch] text-[clamp(1rem,1.6vw,1.35rem)] leading-[1.65] text-[var(--color-silver)]">
              {shop.body}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:gap-5">
            {shop.products.map((product, index) => {
              const href = `mailto:${brand.email}?subject=${encodeURIComponent(
                `Precommande ${product.name} - Drive x Friends`,
              )}&body=${encodeURIComponent(
                `Bonjour Drive x Friends,\n\nJe souhaite demander une precommande pour : ${product.name}.\nTaille souhaitee : \nNom : \nTelephone : \n\nMerci.`,
              )}`;
              return (
                <article
                  key={product.id}
                  className="surface-soft border-soft group relative overflow-hidden rounded-[26px] p-3 sm:rounded-[32px]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-[rgba(var(--rgb-fg),0.04)]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.035]"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(var(--rgb-bg),0.05), rgba(var(--rgb-bg),0.52)), radial-gradient(ellipse at 72% 18%, rgba(244,241,234,0.14), transparent 42%)",
                      }}
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-[rgba(var(--rgb-bg),0.64)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-bone)] backdrop-blur">
                      {product.status}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-3xl font-medium leading-none text-[var(--color-bone)]">
                        {product.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-3 pt-5 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-[var(--color-silver)]">{product.price}</span>
                      <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-silver-dim)]">
                        {product.sizes.join(" / ")}
                      </span>
                    </div>
                    <p className="mt-4 min-h-[72px] text-sm leading-6 text-[var(--color-silver)]">
                      {product.description}
                    </p>
                    <a
                      href={href}
                      className="press mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-bone)] px-5 text-[13px] font-medium text-[var(--color-ink)]"
                    >
                      {shop.cta}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
