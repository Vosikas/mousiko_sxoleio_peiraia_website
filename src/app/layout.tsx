import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/site";
import { NAV } from "@/content";
import { LanguageProvider } from "@/hooks/useLanguage";

const manrope = Manrope({
  subsets: ["greek", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name + " — Αρχική",
    template: "%s | " + site.name,
  },
  description: site.description,
  keywords: [
    "Μουσικό Σχολείο Πειραιά",
    "μουσικό σχολείο",
    "Πειραιάς",
    "μουσική εκπαίδευση",
    "γυμνάσιο λύκειο μουσικό",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  icons: {
    icon: "/logomousiko.png",
    shortcut: "/logomousiko.png",
    apple: "/logomousiko.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={manrope.variable}>
      <body className="grain min-h-screen antialiased">
        <LanguageProvider>
          <SiteHeader nav={NAV} />
          <main id="main">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
