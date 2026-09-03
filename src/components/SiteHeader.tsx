"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 " +
        (scrolled
          ? "border-b border-cream/8 bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent")
      }
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[8deg]" />
          <span className="leading-tight">
            <span className="block font-display text-lg tracking-wide text-cream sm:text-xl">
              Μουσικό Σχολείο
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.42em] text-brass-400">
              Πειραιά
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-3.5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-cream/70 transition-colors hover:text-cream"
            >
              {item.label}
              <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 bg-brass-400 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/epikoinonia"
            className="hidden rounded-full border border-brass-400/45 px-5 py-2.5 text-[0.68rem] uppercase tracking-[0.2em] text-brass-600 transition-all duration-300 hover:border-brass-300 hover:bg-brass-400/12 hover:text-brass-600 md:inline-block"
          >
            Εγγραφές
          </Link>

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
      </div>

      {/* Μενού κινητού */}
      <div
        className={
          "overflow-hidden border-t border-cream/8 bg-ink-950/97 backdrop-blur-xl transition-[max-height,opacity] duration-500 lg:hidden " +
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
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
