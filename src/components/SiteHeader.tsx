"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Logo from "@/components/Logo";
import { useLanguage, type Language } from "@/hooks/useLanguage";

type MenuItem = { label: string; href: string };
type NavItem = MenuItem & { children?: MenuItem[] };

const navItems: NavItem[] = [
  { label: "Αρχική", href: "/" },
  {
    label: "Το Σχολείο μας", href: "/to-scholeio", children: [
      { label: "Ιστορία του Σχολείου – Κτιριακή Υποδομή", href: "/to-scholeio#istoria" },
      { label: "Μαθητές – Φοίτηση (μαθήματα, τμήματα, μαθητικές κοινότητες)", href: "/to-scholeio#foitisi" },
      { label: "Εκπαιδευτικοί", href: "/to-scholeio#ekpaideftikoi" },
      { label: "Σύλλογος Γονέων & Κηδεμόνων", href: "/to-scholeio#goneis" },
      { label: "Ωρολόγιο Πρόγραμμα", href: "/to-scholeio#orologio" },
      { label: "Κανονισμός Λειτουργίας", href: "/to-scholeio#kanonismos" },
      { label: "Αυτοαξιολόγηση Σχολικής Μονάδας", href: "/to-scholeio#aftoaxiologisi" },
      { label: "Σχέδιο Πολιτικής Προστασίας – Μνημόνιο Ενεργειών", href: "/to-scholeio#politiki-prostasias" },
    ],
  },
  { label: "Νέα – Ανακοινώσεις", href: "/nea" },
  {
    label: "Δράσεις", href: "/ekdiloseis", children: [
      { label: "Παρουσιάσεις Εργαστηρίων", href: "/ekdiloseis#ergastiria" },
      { label: "Συναυλίες", href: "/ekdiloseis#synavlies" },
      { label: "Εκδηλώσεις", href: "/ekdiloseis#ekdiloseis" },
      { label: "Προγράμματα (Εθνικά & Ευρωπαϊκά)", href: "/ekdiloseis#programmata" },
      { label: "Εκδρομές", href: "/ekdiloseis#ekdromes" },
    ],
  },
  { label: "Επικοινωνία", href: "/epikoinonia" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const closeEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
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
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 rounded-2xl border border-cream/15 bg-white/95 px-4 py-2.5 shadow-[0_12px_35px_rgba(16,42,67,0.12)] backdrop-blur-xl min-[900px]:max-w-fit min-[900px]:justify-center min-[900px]:rounded-full lg:px-5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 min-[900px]:hidden" onClick={closeMobile}>
          <Logo className="h-10 w-10" />
          <span className="hidden max-w-[180px] font-display text-sm font-semibold leading-tight text-cream sm:block lg:max-w-none">Μουσικό Σχολείο Πειραιά</span>
        </Link>

        <nav className="hidden items-center gap-1 min-[900px]:flex" aria-label="Κύρια πλοήγηση">
          {navItems.map((item, index) => {
            const expanded = openMenu === item.label;
            const activeClass = isActive(item.href) ? "bg-brass-100 text-brass-600 " : "text-cream/75 ";
            return item.children ? (
              <div key={item.label} className="relative" onMouseEnter={() => setOpenMenu(item.label)} onMouseLeave={() => setOpenMenu(null)} onFocus={() => setOpenMenu(item.label)}>
                <div className="flex items-center">
                  <Link href={item.href} className={activeClass + "rounded-l-full px-3 py-2 text-[0.68rem] font-medium transition hover:bg-ink-850 hover:text-cream"}>{item.label}</Link>
                  <button type="button" data-menu-trigger aria-label={`Άνοιγμα ${item.label}`} aria-haspopup="menu" aria-expanded={expanded} onClick={() => setOpenMenu(expanded ? null : item.label)} onKeyDown={(event) => handleMenuKeyDown(event, index)} onFocus={() => setOpenMenu(item.label)} className={activeClass + "rounded-r-full px-2 py-2 transition hover:bg-ink-850 hover:text-cream"}><Chevron expanded={expanded} /></button>
                </div>
                <Dropdown items={item.children} open={expanded} />
              </div>
            ) : <Link key={item.label} href={item.href} className={activeClass + "rounded-full px-3.5 py-2 text-[0.68rem] font-medium transition hover:bg-ink-850 hover:text-cream"}>{item.label}</Link>;
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <button type="button" aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream min-[900px]:hidden">
            <span className="sr-only">Μενού</span>
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
          </button>
        </div>
      </div>

      <div className={(mobileOpen ? "visible opacity-100 " : "pointer-events-none invisible opacity-0 ") + "absolute inset-x-4 top-[calc(100%-0.25rem)] max-h-[calc(100vh-5.5rem)] overflow-y-auto rounded-2xl border border-cream/15 bg-white p-3 shadow-[0_18px_45px_rgba(16,42,67,0.16)] transition-opacity min-[900px]:hidden sm:inset-x-6"}>
        <nav aria-label="Κύρια πλοήγηση κινητού" className="flex flex-col">
          {navItems.map((item) => {
            const expanded = openMenu === item.label;
            return item.children ? (
              <div key={item.label} className="border-b border-cream/8 last:border-0">
                <div className="flex items-center">
                  <Link href={item.href} onClick={(event) => { if (!expanded) { event.preventDefault(); setOpenMenu(item.label); } else closeMobile(); }} className={(isActive(item.href) ? "text-brass-600 " : "text-cream ") + "flex-1 py-3 text-sm font-medium"}>{item.label}</Link>
                  <button type="button" aria-label={`Άνοιγμα ${item.label}`} aria-haspopup="menu" aria-expanded={expanded} onClick={() => setOpenMenu(expanded ? null : item.label)} className="p-3 text-muted"><Chevron expanded={expanded} /></button>
                </div>
                {expanded ? <div role="menu" className="mb-2 border-l-2 border-brass-400/40 pl-3">{item.children.map((child) => <Link key={child.label} href={child.href} role="menuitem" onClick={closeMobile} className="block py-2 text-sm leading-snug text-muted hover:text-brass-600">{child.label}</Link>)}</div> : null}
              </div>
            ) : <Link key={item.label} href={item.href} onClick={closeMobile} className={(isActive(item.href) ? "text-brass-600 " : "text-cream ") + "border-b border-cream/8 py-3 text-sm font-medium last:border-0"}>{item.label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}

function Chevron({ expanded }: { expanded: boolean }) {
  return <svg aria-hidden viewBox="0 0 12 8" className={(expanded ? "rotate-180 " : "") + "h-2 w-3 transition-transform"} fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m1 1 5 5 5-5" /></svg>;
}

function Dropdown({ items, open }: { items: MenuItem[]; open: boolean }) {
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

  return <div ref={menuRef} role="menu" aria-hidden={!open} onKeyDown={handleKeyDown} className={(open ? "visible translate-y-0 opacity-100 " : "pointer-events-none invisible -translate-y-1 opacity-0 ") + "absolute right-0 top-[calc(100%+0.6rem)] z-20 w-80 rounded-2xl border border-cream/15 bg-white p-2 shadow-[0_18px_45px_rgba(16,42,67,0.16)] transition-all duration-200"}>{items.map((child) => <Link key={child.label} href={child.href} role="menuitem" tabIndex={open ? 0 : -1} className="block rounded-xl px-3 py-2.5 text-sm leading-snug text-cream transition hover:bg-brass-100 hover:text-brass-600">{child.label}</Link>)}</div>;
}

function LanguageSwitcher({ language, setLanguage }: { language: Language; setLanguage: (language: Language) => void }) {
  return <div className="flex items-center rounded-full border border-cream/10 bg-ink-850 p-1" aria-label="Επιλογή γλώσσας">{(["GR", "EN"] as const).map((option) => <button key={option} type="button" aria-pressed={language === option} onClick={() => setLanguage(option)} className={(language === option ? "bg-cream text-white " : "text-muted ") + "rounded-full px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.12em] transition hover:text-brass-600"}>{option === "GR" ? "ΕΛ" : "EN"}</button>)}</div>;
}
