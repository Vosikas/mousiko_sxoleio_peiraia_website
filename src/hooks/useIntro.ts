"use client";

import { useSyncExternalStore } from "react";

/**
 * Η οθόνη εισαγωγής παίζει μία φορά ανά επίσκεψη (session).
 * Η πληροφορία ζει στο sessionStorage — εξωτερική πηγή, όχι state του React.
 */

const KEY = "msp:intro";

let seen: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  if (seen === null) {
    try {
      seen = Boolean(sessionStorage.getItem(KEY));
    } catch {
      seen = true; // χωρίς storage (π.χ. αυστηρές ρυθμίσεις) δεν επιμένουμε
    }
  }
  return seen;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Ο server δεν δείχνει ποτέ την intro — μπαίνει μετά το hydration. */
const serverSnapshot = () => true;

/** true όταν η intro έχει ήδη παιχτεί σε αυτή την επίσκεψη. */
export function useIntroSeen(): boolean {
  return useSyncExternalStore(subscribe, read, serverSnapshot);
}

/**
 * Αποκαλύπτει τη σελίδα κάτω από την intro.
 * Καλείται μόλις ξεκινήσει η έξοδος, ώστε να φαίνεται το site καθώς η
 * οθόνη ανεβαίνει — όχι μαύρο φόντο.
 */
export function revealPage() {
  document.documentElement.removeAttribute("data-intro");
}

/** Σημειώνει την intro ως ολοκληρωμένη και ειδοποιεί τα components. */
export function markIntroSeen() {
  seen = true;
  revealPage();
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* αγνοείται */
  }
  for (const l of listeners) l();
}
