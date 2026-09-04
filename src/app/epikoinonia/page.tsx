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
    <main className="bg-[#f7fbfb] text-[#102a43]">
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_20%_0%,rgba(14,147,140,0.14),transparent_60%),radial-gradient(45%_90%_at_85%_10%,rgba(244,185,66,0.16),transparent_60%)]"
        />

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
            <section aria-labelledby="details">
              <h2 id="details" className="sr-only">
                Στοιχεία επικοινωνίας
              </h2>

              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e938c]"
              >
                <p className="font-display text-[clamp(1.5rem,3.4vw,2.1rem)] font-semibold leading-tight decoration-[#0e938c]/40 underline-offset-8 group-hover:underline">
                  {SCHOOL.street}
                  <br />
                  {SCHOOL.postcode} {SCHOOL.area}
                </p>
                <p className="mt-2 text-sm text-[#0b6f6a]">Άνοιγμα στους Χάρτες Google</p>
              </a>

              <dl className="mt-10 divide-y divide-[#dde8ee] border-y border-[#dde8ee]">
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-5">
                  <dt className="w-28 shrink-0 text-sm text-[#5b7285]">Τηλέφωνο</dt>
                  <dd className="text-lg">
                    <a
                      href={`tel:${SCHOOL.phone.replace(/\s/g, "")}`}
                      className="tabular-nums transition hover:text-[#0b6f6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e938c]"
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
                      className="break-all transition hover:text-[#0b6f6a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e938c]"
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
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4b942]" aria-hidden />
                      <p className="leading-relaxed">
                        <span className="font-medium">{item.mode}.</span>{" "}
                        <span className="text-[#3d5568]">{item.detail}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section aria-labelledby="form-heading">
              <h2 id="form-heading" className="sr-only">
                Φόρμα επικοινωνίας
              </h2>
              <ContactForm />
            </section>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
        <div className="rounded-2xl border border-[#e3ecf1] bg-white p-6 sm:p-10">
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
            className="text-sm font-medium text-[#0b6f6a] underline decoration-[#0e938c]/30 underline-offset-4 transition hover:decoration-[#0e938c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e938c]"
          >
            Οδηγίες πλοήγησης
          </a>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e3ecf1] bg-white shadow-[0_18px_50px_-34px_rgba(16,42,67,0.5)]">
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
