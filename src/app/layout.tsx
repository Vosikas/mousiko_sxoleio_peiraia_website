import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

import LoadingScreen from "@/components/LoadingScreen";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  subsets: ["greek", "latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["greek", "latin"],
  variable: "--font-inter",
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={cormorant.variable + " " + inter.variable}>
      <body className="grain min-h-screen antialiased">
        <LoadingScreen />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
