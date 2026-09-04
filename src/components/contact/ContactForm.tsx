"use client";

import { useId, useRef, useState } from "react";
import {
  EMPTY_CONTACT,
  hasErrors,
  TOPICS,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "failed";

const field =
  "w-full rounded-xl border bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9db0be] focus:border-[#0e938c] focus:ring-4 focus:ring-[#0e938c]/15";
const ok = "border-[#dbe6ec]";
const bad = "border-[#d1534a] ring-4 ring-[#d1534a]/10";

export default function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<ContactInput>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const describe = (key: keyof ContactInput) => (errors[key] ? `${id}-${key}-error` : undefined);

  const submit = async () => {
    const found = validateContact(values);
    setErrors(found);
    if (hasErrors(found)) {
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("sending");
    setFailure("");
    try {
      const response = await fetch("/api/epikoinonia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        errors?: ContactErrors;
        message?: string;
      };

      if (response.ok && data.ok) {
        setStatus("sent");
        return;
      }
      if (response.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setStatus("failed");
      setFailure(
        response.status === 429
          ? "Στάλθηκαν πολλά μηνύματα από αυτή τη σύνδεση. Δοκιμάστε ξανά σε λίγα λεπτά."
          : data.message || "Το μήνυμα δεν στάλθηκε. Δοκιμάστε ξανά ή τηλεφωνήστε στη γραμματεία.",
      );
    } catch {
      setStatus("failed");
      setFailure("Δεν υπάρχει σύνδεση με τον διακομιστή. Ελέγξτε το δίκτυο και δοκιμάστε ξανά.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[#0e938c]/25 bg-[#0e938c]/[0.06] p-8">
        <p className="font-display text-2xl font-semibold text-[#0b6f6a]">Το μήνυμα στάλθηκε</p>
        <p className="mt-3 max-w-prose text-[#3d5568]">
          Η γραμματεία απαντά συνήθως μέσα σε δύο εργάσιμες ημέρες. Θα λάβετε απάντηση στο {values.email}.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY_CONTACT);
            setStatus("idle");
          }}
          className="btn-ghost mt-6 rounded-full border px-5 py-2.5 font-medium"
        >
          Στείλτε κι άλλο μήνυμα
        </button>
      </div>
    );
  }

  return (
    <div ref={formRef} className="rounded-2xl border border-[#e3ecf1] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(16,42,67,0.45)] sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-[#102a43]">Στείλτε μας μήνυμα</h2>
      <p className="mt-2 text-sm text-[#5b7285]">Τα πεδία με αστερίσκο είναι υποχρεωτικά.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-medium text-[#102a43]">
            Ονοματεπώνυμο *
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
            className={`${field} ${errors.name ? bad : ok}`}
          />
          <FieldError id={`${id}-name-error`} message={errors.name} />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={`${id}-email`} className="mb-1.5 block text-sm font-medium text-[#102a43]">
            Email *
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => set("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
            className={`${field} ${errors.email ? bad : ok}`}
          />
          <FieldError id={`${id}-email-error`} message={errors.email} />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={`${id}-phone`} className="mb-1.5 block text-sm font-medium text-[#102a43]">
            Τηλέφωνο
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Προαιρετικό"
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describe("phone")}
            className={`${field} ${errors.phone ? bad : ok}`}
          />
          <FieldError id={`${id}-phone-error`} message={errors.phone} />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor={`${id}-topic`} className="mb-1.5 block text-sm font-medium text-[#102a43]">
            Θέμα *
          </label>
          <select
            id={`${id}-topic`}
            name="topic"
            value={values.topic}
            onChange={(event) => set("topic", event.target.value)}
            className={`${field} ${errors.topic ? bad : ok} appearance-none bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='8' fill='none' stroke='%235b7285' stroke-width='2'><path d='M1 1l6 6 6-6'/></svg>\")",
            }}
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-medium text-[#102a43]">
            Μήνυμα *
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => set("message", event.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describe("message")}
            className={`${field} ${errors.message ? bad : ok} resize-y`}
          />
          <div className="mt-1.5 flex justify-between gap-4">
            <FieldError id={`${id}-message-error`} message={errors.message} />
            <span className="shrink-0 text-xs tabular-nums text-[#8ea3b3]">{values.message.length}/4000</span>
          </div>
        </div>

        <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor={`${id}-website`}>Ιστότοπος</label>
          <input
            id={`${id}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(event) => set("website", event.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3d5568]">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(event) => set("consent", event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describe("consent")}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#c6d5df] text-[#0e938c] focus:ring-[#0e938c]"
            />
            <span>Συμφωνώ να χρησιμοποιηθούν τα στοιχεία μου αποκλειστικά για την απάντηση σε αυτό το μήνυμα. *</span>
          </label>
          <FieldError id={`${id}-consent-error`} message={errors.consent} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending"}
          className="btn-solid inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-medium"
        >
          {status === "sending" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Αποστολή
            </>
          ) : (
            "Αποστολή μηνύματος"
          )}
        </button>
        <p className="text-sm text-[#5b7285]">Απαντάμε συνήθως σε δύο εργάσιμες ημέρες.</p>
      </div>

      <p aria-live="assertive" className="sr-only">
        {status === "failed" ? failure : ""}
      </p>
      {status === "failed" ? (
        <p className="mt-5 rounded-xl border border-[#d1534a]/30 bg-[#d1534a]/[0.06] px-4 py-3 text-sm text-[#a03a32]">
          {failure}
        </p>
      ) : null}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-[#c0392b]">
      {message}
    </p>
  );
}
