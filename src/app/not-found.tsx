import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[75svh] max-w-2xl flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[9rem] leading-none text-brass-400/25 sm:text-[12rem]">404</p>
      <h1 className="-mt-6 font-display text-4xl text-cream sm:text-5xl">Παύση</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
        Η σελίδα που ζητήσατε δεν βρέθηκε — ίσως μετακινήθηκε ή άλλαξε διεύθυνση.
      </p>
      <Link
        href="/"
        className="btn-ghost mt-10 rounded-full border px-7 py-3.5 text-[0.66rem] uppercase tracking-[0.22em]"
      >
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
