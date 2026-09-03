"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { useLanguage } from "@/hooks/useLanguage";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className="absolute inset-x-0 top-0 z-50 px-4 py-4 lg:px-8"
    >
      <div className="relative mx-auto flex max-w-[1500px] justify-center">
        <div className="flex max-w-fit items-center gap-2 rounded-full border border-cream/15 bg-white/90 px-2 py-2 shadow-[0_12px_35px_rgba(16,42,67,0.10)] backdrop-blur-xl">
        <nav className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-full px-3.5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream/70 transition-colors hover:bg-ink-850 hover:text-cream"
            >
              {t(item.label)}
              <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-brass-400 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full border border-cream/10 bg-ink-850/80 p-1" aria-label="Επιλογή γλώσσας">
            {(["GR", "EN"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={language === option}
                onClick={() => setLanguage(option)}
                className={
                  "rounded-full px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.12em] transition " +
                  (language === option ? "bg-cream text-white" : "text-muted hover:text-cream")
                }
              >
                {option}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-cream/15 transition hover:border-brass-400/60 lg:hidden"
          >
            <span
              className={
                "h-px w-4 bg-cream transition-transform duration-300 " +
                (open ? "translate-y-[3px] rotate-45" : "")
              }
            />
            <span
              className={
                "h-px w-4 bg-cream transition-transform duration-300 " +
                (open ? "-translate-y-[3px] -rotate-45" : "")
              }
            />
          </button>
        </div>
        <Link
          href="/epikoinonia"
          className="absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-brass-500 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-brass-600 md:inline-block"
        >
          {t("Εγγραφές")}
        </Link>
      </div>

      {/* Μενού κινητού */}
      <div
        className={
          "mx-4 overflow-hidden rounded-3xl border border-cream/15 bg-white/95 shadow-[0_12px_35px_rgba(16,42,67,0.10)] backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden " +
          (open ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0")
        }
      >
        <nav className="mx-auto flex max-w-[1500px] flex-col px-5 py-4">
          {site.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: i * 40 + "ms" }}
              className="border-b border-cream/6 py-4 text-sm uppercase tracking-[0.22em] text-cream/80 transition-colors last:border-0 hover:text-brass-600"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
