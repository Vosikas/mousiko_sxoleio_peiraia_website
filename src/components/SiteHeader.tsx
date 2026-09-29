"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Logo from "@/components/Logo";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { site } from "@/lib/site";

import type { NavItem, NavLink } from "@/content/types";

/*
 * Το μενού ΔΕΝ ορίζεται εδώ: έρχεται ως prop από το layout, χτισμένο από το
 * src/content/index.ts (NAV). Έτσι μια νέα υποσελίδα μπαίνει στο μενού μόνη
 * της, και τα κείμενα των σελίδων δεν φορτώνονται ποτέ στον browser.
 */

export default function SiteHeader({ nav }: { nav: NavItem[] }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Το αναδυόμενο μενού πάνω δεξιά: κεντρικό μενού + επικοινωνία (ό,τι έχει το υποσέλιδο).
  const [quickOpen, setQuickOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
        setQuickOpen(false);
      }
    };
    const closeEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setQuickOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const closeMobile = () => {
    setMobileOpen(false);
    setOpenMenu(null);
    setQuickOpen(false);
  };
  // Δύο αναδυόμενα δεν ανοίγουν ταυτόχρονα: το ένα κλείνει το άλλο.
  const openDropdown = (label: string) => {
    setOpenMenu(label);
    setQuickOpen(false);
  };
  const toggleQuick = () => {
    setQuickOpen((value) => !value);
    setOpenMenu(null);
  };
  const handleMenuKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const buttons = Array.from(headerRef.current?.querySelectorAll<HTMLButtonElement>("[data-menu-trigger]") ?? []);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      buttons[(index + 1) % buttons.length]?.focus();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
    }
  };

  return (
    <header ref={headerRef} className="sticky inset-x-0 top-0 z-50 px-4 py-3 sm:px-6 lg:px-8">
      {/* Σήμα σχολείου: πάνω αριστερά, ΕΞΩ από τη μπάρα πλοήγησης.
          ΟΧΙ στην αρχική — εκεί το λογότυπο υπάρχει ήδη μεγάλο στο hero.
          Εμφανίζεται από 1100px και πάνω: πιο κάτω η κεντραρισμένη μπάρα
          πιάνει όλο το πλάτος και το λογότυπο μπαίνει μέσα της. */}
      {pathname !== "/" && (
        <Link
          href="/"
          aria-label="Μουσικό Σχολείο Πειραιά — Αρχική"
          onClick={closeMobile}
          className="absolute left-4 top-1 hidden transition-opacity hover:opacity-80 min-[1100px]:block sm:left-6 lg:left-8"
        >
          <Logo className="h-20 w-20" />
        </Link>
      )}

      {/* «Μενού» πάνω δεξιά, ΕΞΩ από τη μπάρα — συμμετρικό με το λογότυπο.
          Ίδιο ύψος με τη μπάρα (3.375rem). Στα 900–1100px μπαίνει μέσα
          στη μπάρα (δεν χωράει δίπλα της)· στο κινητό το ίδιο περιεχόμενο
          είναι στο μενού ☰. */}
      <button
        type="button"
        aria-expanded={quickOpen}
        aria-controls="quick-menu"
        onClick={toggleQuick}
        className={
          (quickOpen ? "bg-plum-100 text-plum-500 " : "bg-white/95 text-cream/80 hover:text-plum-500 ") +
          "absolute right-4 top-3 hidden h-[3.375rem] items-center gap-2.5 rounded-full border border-cream/15 px-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] shadow-[0_12px_35px_rgba(16,42,67,0.12)] backdrop-blur-xl transition min-[1100px]:flex sm:right-6 lg:right-8"
        }
      >
        <GridIcon />
        {t("Μενού")}
      </button>

      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 rounded-2xl border border-cream/15 bg-white/95 px-4 py-2.5 shadow-[0_12px_35px_rgba(16,42,67,0.12)] backdrop-blur-xl min-[900px]:max-w-fit min-[900px]:justify-center min-[900px]:rounded-full lg:px-5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 min-[1100px]:hidden" onClick={closeMobile}>
          <Logo className="h-10 w-10" />
          {/* Το όνομα μόνο στο κινητό: στα 900–1100px η μπάρα έχει ήδη όλο το menu
              και θα ξεχείλιζε. */}
          <span className="hidden max-w-[180px] font-display text-sm font-semibold leading-tight text-cream sm:block min-[900px]:hidden">Μουσικό Σχολείο Πειραιά</span>
        </Link>

        <nav className="hidden items-center gap-1 min-[900px]:flex" aria-label="Κύρια πλοήγηση">
          {nav.map((item, index) => {
            const expanded = openMenu === item.label;
            const activeClass = isActive(item.href) ? "bg-plum-100 text-plum-500 " : "text-cream/75 ";
            return item.children ? (
              <div key={item.label} className="relative" onMouseEnter={() => openDropdown(item.label)} onFocus={() => openDropdown(item.label)}>
                {/* ΕΝΑ pill για σύνδεσμο + βελάκι: κοινό φόντο και κοινή καμπύλη,
                    ίδιο ύψος με τα υπόλοιπα στοιχεία (items-stretch). Μένει
                    τονισμένο όσο το dropdown είναι ανοιχτό. */}
                <div className={(isActive(item.href) || expanded ? "bg-plum-100 text-plum-500 " : "text-cream/75 ") + "flex items-stretch rounded-full transition hover:bg-plum-100 hover:text-plum-500"}>
                  <Link href={item.href} className="flex items-center rounded-l-full py-2 pl-3.5 pr-1.5 text-[0.68rem] font-medium">{item.label}</Link>
                  <button type="button" data-menu-trigger aria-label={`Άνοιγμα ${item.label}`} aria-haspopup="menu" aria-expanded={expanded} onClick={() => (expanded ? setOpenMenu(null) : openDropdown(item.label))} onKeyDown={(event) => handleMenuKeyDown(event, index)} onFocus={() => openDropdown(item.label)} className="flex items-center rounded-r-full py-2 pl-1 pr-3"><Chevron expanded={expanded} /></button>
                </div>
                <Dropdown items={item.children} open={expanded} />
              </div>
            ) : <Link key={item.label} href={item.href} className={activeClass + "rounded-full px-3.5 py-2 text-[0.68rem] font-medium transition hover:bg-plum-100 hover:text-plum-500"}>{item.label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button
            type="button"
            aria-label={t("Μενού")}
            aria-expanded={quickOpen}
            aria-controls="quick-menu"
            onClick={toggleQuick}
            className={(quickOpen ? "bg-plum-100 text-plum-500 " : "text-cream/75 hover:bg-plum-100 hover:text-plum-500 ") + "hidden h-8 w-8 items-center justify-center rounded-full transition min-[900px]:flex min-[1100px]:hidden"}
          >
            <GridIcon />
          </button>
          <button type="button" aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream min-[900px]:hidden">
            <span className="sr-only">Μενού</span>
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>

      {/* Το αναδυόμενο πάνελ (≥900px): κεντρικό μενού + επικοινωνία. */}
      <div
        id="quick-menu"
        className={
          (quickOpen ? "visible translate-y-0 opacity-100 " : "pointer-events-none invisible -translate-y-1 opacity-0 ") +
          "absolute right-4 top-[calc(100%-0.25rem)] hidden w-[22rem] rounded-2xl border border-cream/15 bg-white p-2 shadow-[0_18px_45px_rgba(16,42,67,0.16)] transition-all duration-200 min-[900px]:block sm:right-6 lg:right-8"
        }
      >
        <nav aria-label={t("Πλοήγηση")}>
          <p className="px-3 pb-2 pt-3 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-plum-500">{t("Πλοήγηση")}</p>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={quickOpen ? 0 : -1}
                  onClick={closeMobile}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={(isActive(item.href) ? "bg-plum-100 font-semibold text-plum-500 " : "text-cream hover:bg-plum-100 hover:text-plum-500 ") + "block rounded-xl px-3 py-2.5 text-sm transition"}
                >
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ContactDetails className="mt-2" linkTabIndex={quickOpen ? 0 : -1} />
      </div>

      <div className={(mobileOpen ? "visible opacity-100 " : "pointer-events-none invisible opacity-0 ") + "absolute inset-x-4 top-[calc(100%-0.25rem)] max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-cream/15 bg-white p-3 shadow-[0_18px_45px_rgba(16,42,67,0.16)] transition-opacity min-[900px]:hidden sm:inset-x-6"}>
        <nav aria-label="Κύρια πλοήγηση κινητού" className="flex flex-col">
          {nav.map((item) => {
            const expanded = openMenu === item.label;
            return item.children ? (
              <div key={item.label} className="border-b border-cream/8 last:border-0">
                <div className="flex items-center">
                  <Link href={item.href} onClick={(event) => { if (!expanded) { event.preventDefault(); setOpenMenu(item.label); } else closeMobile(); }} className={(isActive(item.href) ? "text-plum-500 " : "text-cream ") + "flex-1 py-3 text-sm font-medium"}>{item.label}</Link>
                  <button type="button" aria-label={`Άνοιγμα ${item.label}`} aria-haspopup="menu" aria-expanded={expanded} onClick={() => setOpenMenu(expanded ? null : item.label)} className="p-3 text-muted"><Chevron expanded={expanded} /></button>
                </div>
                {expanded ? <div role="menu" className="mb-2 border-l-2 border-plum-500/40 pl-3">{item.children.map((child) => <Link key={child.label} href={child.href} role="menuitem" onClick={closeMobile} className="block py-2 text-sm leading-snug text-muted hover:text-plum-500">{child.label}</Link>)}</div> : null}
              </div>
            ) : <Link key={item.label} href={item.href} onClick={closeMobile} className={(isActive(item.href) ? "text-plum-500 " : "text-cream ") + "border-b border-cream/8 py-3 text-sm font-medium last:border-0"}>{item.label}</Link>;
          })}
        </nav>
        <ContactDetails className="mt-3" />
      </div>
    </header>
  );
}

/** Τα στοιχεία επικοινωνίας του υποσέλιδου, σε γκρι κουτί. */
function ContactDetails({ className = "", linkTabIndex }: { className?: string; linkTabIndex?: number }) {
  const { t } = useLanguage();
  const { address, phone, email } = site.contact;
  return (
    <div className={"surface-box rounded-xl p-4 text-sm " + className}>
      <p className="text-[0.6rem] font-medium uppercase tracking-[0.28em] surface-box-accent">{t("Επικοινωνία")}</p>
      <ul className="mt-3 space-y-2">
        <li className="text-cream/80">{t(address)}</li>
        <li>
          <a href={"tel:" + phone.replace(/\s/g, "")} tabIndex={linkTabIndex} className="tabular-nums text-cream transition hover:text-plum-500">
            {phone}
          </a>
        </li>
        <li>
          <a href={"mailto:" + email} tabIndex={linkTabIndex} className="break-all text-cream transition hover:text-plum-500">
            {email}
          </a>
        </li>
      </ul>
    </div>
  );
}

function GridIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" />
      <rect x="9.5" y="1" width="5.5" height="5.5" rx="1.5" />
      <rect x="1" y="9.5" width="5.5" height="5.5" rx="1.5" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.5" />
    </svg>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return <svg aria-hidden viewBox="0 0 12 8" className={(expanded ? "rotate-180 " : "") + "h-2 w-3 transition-transform"} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m1 1 5 5 5-5" /></svg>;
}

function Dropdown({ items, open }: { items: NavLink[]; open: boolean }) {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const links = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitem']") ?? []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
    links[next]?.focus();
  };

  return <div ref={menuRef} role="menu" aria-hidden={!open} onKeyDown={handleKeyDown} className={(open ? "visible translate-y-0 opacity-100 " : "pointer-events-none invisible -translate-y-1 opacity-0 ") + "absolute right-0 top-[calc(100%+0.6rem)] z-20 w-80 rounded-2xl border border-cream/15 bg-white p-2 shadow-[0_18px_45px_rgba(16,42,67,0.16)] transition-all duration-200"}>{items.map((child) => <Link key={child.label} href={child.href} role="menuitem" tabIndex={open ? 0 : -1} className="block rounded-xl px-3 py-2.5 text-sm leading-snug text-cream transition hover:bg-plum-100 hover:text-plum-500">{child.label}</Link>)}</div>;
}

function LanguageSwitcher({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  return <div className="flex items-center rounded-full border border-cream/10 bg-ink-850 p-1" aria-label="Επιλογή γλώσσας">{(["GR", "EN"] as const).map((option) => <button key={option} type="button" aria-pressed={language === option} onClick={() => setLanguage(option)} className={(language === option ? "bg-cream text-white " : "text-muted ") + "rounded-full px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.12em] transition hover:text-plum-500"}>{option === "GR" ? "ΕΛ" : "EN"}</button>)}</div>;
}
