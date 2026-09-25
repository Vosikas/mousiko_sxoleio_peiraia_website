/**
 * Η κεφαλίδα κάθε σελίδας ενότητας: ετικέτα, τίτλος και εισαγωγή.
 * (Χωρίς γραμμή διαδρομής: θα κολλούσε στο λογότυπο πάνω αριστερά, και
 * τον προσανατολισμό τον δίνουν ήδη η ετικέτα και το πλαϊνό μενού.)
 * Κοινή για την κεντρική σελίδα και τις υποσελίδες, ώστε όλες να
 * «μιλάνε» με τον ίδιο τρόπο.
 */
export default function PageIntro({
  eyebrow,
  title,
  lead,
  draft = false,
  size = "lg",
}: {
  eyebrow: string;
  title: string;
  lead: string;
  draft?: boolean;
  /** lg: κεντρική σελίδα ενότητας · md: υποσελίδα (οι τίτλοι είναι μεγαλύτεροι) */
  size?: "lg" | "md";
}) {
  return (
    <header className="max-w-3xl">
      <p
        className="flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-plum-500"
        style={{ animation: "rise 0.9s 0.05s both" }}
      >
        <span aria-hidden className="h-px w-10 bg-current opacity-60" />
        {eyebrow}
      </p>

      <h1
        className={
          "mt-5 font-display font-semibold tracking-tight text-cream " +
          (size === "lg"
            ? "text-[clamp(2.4rem,7vw,4.2rem)] leading-[1.02]"
            : "text-[clamp(2rem,4.6vw,3.25rem)] leading-[1.08]")
        }
        style={{ animation: "rise 1s 0.12s both" }}
      >
        {title}
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-muted" style={{ animation: "rise 1s 0.2s both" }}>
        {lead}
      </p>

      {draft && (
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-plum-500/25 bg-plum-100 px-3.5 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-plum-600">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-plum-500" />
          Ενδεικτικό περιεχόμενο — υπό συμπλήρωση
        </p>
      )}
    </header>
  );
}
