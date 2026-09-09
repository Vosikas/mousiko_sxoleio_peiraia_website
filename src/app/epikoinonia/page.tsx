import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import OfficeHours from "@/components/contact/OfficeHours";
import { ADDRESS_LINE, MAPS_EMBED, MAPS_LINK, SCHOOL } from "@/lib/school";

export const metadata: Metadata = {
  title: "Επικοινωνία — Μουσικό Σχολείο Πειραιά",
  description:
    "Διεύθυνση, τηλέφωνο, email και ωράριο γραμματείας του Μουσικού Σχολείου Πειραιά, μαζί με φόρμα επικοινωνίας.",
  alternates: { canonical: "/epikoinonia" },
};

export default function ContactPage() {
  return (
    <main className="bg-[var(--page-bg)] text-[var(--page-text)]">
      <div className="relative overflow-hidden">
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-16 sm:px-8 sm:pt-24">
          <header className="max-w-2xl">
            <h1 className="font-display text-[clamp(2.4rem,7vw,4.2rem)] font-semibold leading-[1.02] tracking-tight">
              Επικοινωνία
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#3d5568]">
              Η γραμματεία απαντά σε ερωτήματα για εγγραφές, εισαγωγικές εξετάσεις, μεταγραφές και μουσικά όργανα.
              Τηλεφωνήστε, γράψτε μας ή περάστε από το σχολείο.
            </p>
          </header>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            {/* ΓΚΡΙ ΚΟΥΤΙ — ίδιο μοτίβο με τις κάρτες στα «Νέα». */}
            <section aria-labelledby="details" className="surface-box p-7 sm:p-10">
              <h2 id="details" className="sr-only">
                Στοιχεία επικοινωνίας
              </h2>

              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary-purple)]"
              >
                <p className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-semibold leading-tight decoration-[var(--primary-purple)]/40 underline-offset-8 group-hover:underline">
                  {SCHOOL.street}
                  <br />
                  {SCHOOL.postcode} {SCHOOL.area}
                </p>
                <p className="mt-2 text-sm text-[var(--primary-purple)]">Άνοιγμα στους Χάρτες Google</p>
              </a>

              <dl className="mt-10 divide-y divide-[#dde8ee] border-y border-[#dde8ee]">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  <dt className="w-28 shrink-0 text-sm text-[#5b7285]">Τηλέφωνο</dt>
                  <dd className="text-lg">
                    <a
                      href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                      className="tabular-nums transition hover:text-[var(--primary-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-purple)]"
                    >
                      {SCHOOL.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  <dt className="w-28 shrink-0 text-sm text-[#5b7285]">Email</dt>
                  <dd className="min-w-0 text-lg">
                    <a
                      href={`mailto:${SCHOOL.email}`}
                      className="break-all transition hover:text-[var(--primary-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-purple)]"
                    >
                      {SCHOOL.email}
                    </a>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  <dt className="w-28 shrink-0 text-sm text-[#5b7285]">Ταχυδρομείο</dt>
                  <dd className="text-lg">{ADDRESS_LINE}</dd>
                </div>
              </dl>

              <div className="mt-10">
                <h3 className="text-sm font-medium text-[#5b7285]">Πώς θα έρθετε</h3>
                <ul className="mt-4 space-y-4">
                  {SCHOOL.transit.map((item) => (
                    <li key={item.mode} className="flex gap-4">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-purple)]" aria-hidden />
                      <p className="leading-relaxed">
                        <span className="font-medium">{item.mode}.</span>{" "}
                        <span className="text-[#3d5568]">{item.detail}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="form-heading" className="surface-box p-7 sm:p-10">
              <h2 id="form-heading" className="sr-only">
                Φόρμα επικοινωνίας
              </h2>
              <ContactForm />
            </section>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        <div className="surface-box p-6 sm:p-10">
          <OfficeHours />
        </div>
      </div>

      <section aria-labelledby="map-heading" className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="map-heading" className="font-display text-2xl font-semibold sm:text-3xl">
            Στον χάρτη
          </h2>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-[var(--primary-purple)] underline decoration-[var(--primary-purple)]/30 underline-offset-4 transition hover:decoration-[var(--primary-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-purple)]"
          >
            Οδηγίες πλοήγησης
          </a>
        </div>
        <div className="surface-box mt-6 overflow-hidden p-2">
          <iframe
            title={`Χάρτης: ${SCHOOL.name}, ${ADDRESS_LINE}`}
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[340px] w-full border-0 sm:h-[460px]"
          />
        </div>
      </section>
    </main>
  );
}
