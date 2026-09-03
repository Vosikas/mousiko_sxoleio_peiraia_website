import Link from "next/link";
import Logo from "./Logo";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="relative mt-28 border-t border-cream/8 bg-ink-900">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brass-400/50 to-transparent" />

      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <span>
              <span className="block font-display text-2xl text-cream">{site.name}</span>
              <span className="block text-[0.62rem] uppercase tracking-[0.4em] text-brass-400">
                {site.tagline}
              </span>
            </span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted">{site.description}</p>
          <div className="mt-7 flex gap-3">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-cream/12 px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] text-cream/70 transition hover:border-brass-400/60 hover:text-brass-600"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[0.68rem] uppercase tracking-[0.3em] text-brass-400">Πλοήγηση</h3>
          <ul className="mt-5 space-y-3">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cream/70 transition hover:text-brass-600"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[0.68rem] uppercase tracking-[0.3em] text-brass-400">Επικοινωνία</h3>
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            <li>{site.contact.address}</li>
            <li>
              <a href={"tel:" + site.contact.phone.replace(/\s/g, "")} className="hover:text-brass-600">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={"mailto:" + site.contact.email} className="break-all hover:text-brass-600">
                {site.contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-5 py-6 text-[0.68rem] uppercase tracking-[0.22em] text-muted/70 sm:flex-row lg:px-10">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="text-brass-400">♪</span> Με μουσική και προσοχή στη λεπτομέρεια
          </span>
        </div>
      </div>
    </footer>
  );
}
