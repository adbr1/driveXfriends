import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppMotionConfig } from "@/components/providers/motion-config";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "./globals.css";

const SITE_URL = "https://drivexfriends.lu";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Drive x Friends — Club automobile au Luxembourg",
  description:
    "Drive x Friends rassemble les passionnés de voitures d'exception autour de balades, rencontres exclusives et Cars & Coffee au Luxembourg.",
  applicationName: "Drive x Friends",
  keywords: ["Drive x Friends", "club automobile", "Luxembourg", "Cars & Coffee", "voitures d'exception"],
  authors: [{ name: "Drive x Friends" }],
  openGraph: {
    type: "website",
    locale: "fr_LU",
    title: "Drive x Friends — Club automobile au Luxembourg",
    description:
      "Routes d'exception. Voitures d'exception. Rencontres d'exception. Le club automobile de référence au Luxembourg.",
    siteName: "Drive x Friends",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive x Friends",
    description: "Le club automobile de référence au Luxembourg.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Drive x Friends",
  alternateName: "Luxembourg Automotive Club",
  url: SITE_URL,
  email: "drivexfriends@gmail.com",
  sameAs: ["https://instagram.com/drivexfriends"],
  address: { "@type": "PostalAddress", addressCountry: "LU", addressLocality: "Luxembourg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Aller au contenu</a>
        <AppMotionConfig>
          <SmoothScroll />
          {children}
        </AppMotionConfig>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
