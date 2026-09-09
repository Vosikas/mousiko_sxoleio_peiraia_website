"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { useLanguage } from "@/hooks/useLanguage";

const STATS = [
  { value: "420", label: "μαθητές & μαθήτριες" },
  { value: "18", label: "μουσικά σύνολα" },
  { value: "35", label: "χρόνια λειτουργίας" },
];

/**
 * HERO — δύο στήλες:
 *   ΑΡΙΣΤΕΡΑ  το λογότυπο του σχολείου (καθαρό, πάνω σε λευκό)
 *   ΔΕΞΙΑ     γκρι κουτί (#e3e3e3) με το περιεχόμενο σε μωβ τονισμούς
 *
 * Ακολουθεί το γενικό μοτίβο του site:
 *   ΛΕΥΚΗ ενότητα → ΓΚΡΙ κουτί (.surface-box) → ΜΩΒ περιεχόμενο.
 * Όλα τα χρώματα έρχονται από το src/app/globals.css — κανένα #hex εδώ.
 */
export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative bg-[var(--page-bg)] pt-28">
      <div className="mx-auto grid w-full max-w-[1500px] items-center gap-12 px-5 pb-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-16 lg:px-10">
        {/* ---------------- ΑΡΙΣΤΕΡΑ: λογότυπο ---------------- */}
        <div
          className="flex justify-center lg:justify-start"
          style={{ animation: "rise 1s 0.1s both" }}
        >
          <Image
            src="/logomousiko.png"
            alt={site.name}
            width={643}
            height={756}
            priority
            className="h-auto w-[min(72%,20rem)] lg:w-full lg:max-w-[24rem]"
          />
          {/* Το <h1> για SEO/αναγνώστες οθόνης — οπτικά ο τίτλος είναι το λογότυπο. */}
          <h1 className="sr-only">{site.name}</h1>
        </div>

        {/* ---------------- ΔΕΞΙΑ: γκρι κουτί ---------------- */}
        <div className="relative" style={{ animation: "rise 1.1s 0.3s both" }}>
          {/* Δεύτερο κουτί σε μετατόπιση — δίνει το βάθος του reference. */}
          <div
            aria-hidden
            className="surface-box absolute -bottom-8 left-6 right-6 top-20 -z-10 opacity-55"
          />

          <div className="surface-box relative overflow-hidden p-7 sm:p-10 lg:p-14">
            {/* Υδατογράφημα λογοτύπου μέσα στο κουτί: το αρχείο είναι λευκό,
                οπότε πάνω στο γκρι διαβάζεται σαν ανοιχτά πλήκτρα πιάνου. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LOGO%20AXNO%202.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -right-4 top-1/2 w-[85%] -translate-y-1/2 opacity-70"
            />

            <div className="relative">
              {/* Eyebrow */}
              <p className="flex items-center gap-3 text-[0.6rem] font-medium uppercase tracking-[0.3em] surface-box-accent">
                <span className="h-px w-10 bg-current opacity-60" />
                {t("Γυμνάσιο & Λύκειο · Δημόσια μουσική εκπαίδευση")}
              </p>

              {/* Περιγραφή */}
              <p className="mt-7 max-w-xl text-base leading-relaxed sm:text-lg">
                {t(site.description)}
              </p>

              {/* Κουμπιά */}
              <div className="surface-box-rule mt-9 flex flex-wrap items-center gap-4 border-t pt-9">
                <Link
                  href="/to-scholeio"
                  className="btn-solid group relative overflow-hidden rounded-full px-8 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] duration-300 hover:scale-[1.03]"
                >
                  <span className="relative z-10">{t("Γνωρίστε το σχολείο")}</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>

                <a
                  href="#video"
                  className="btn-ghost group flex items-center gap-3 rounded-full border bg-white px-7 py-4 text-[0.7rem] uppercase tracking-[0.2em] duration-300"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current/50">
                    <svg viewBox="0 0 24 24" className="ml-px h-2.5 w-2.5 fill-current">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14Z" />
                    </svg>
                  </span>
                  {t("Δείτε το βίντεο")}
                </a>
              </div>

              {/* Στατιστικά */}
              <dl className="surface-box-rule mt-9 grid grid-cols-2 gap-x-10 gap-y-7 border-t pt-9 sm:grid-cols-3">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{t(s.label)}</dt>
                    <dd>
                      <span className="block font-display text-4xl font-semibold surface-box-accent">
                        {s.value}
                      </span>
                      <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.22em] opacity-70">
                        {t(s.label)}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
