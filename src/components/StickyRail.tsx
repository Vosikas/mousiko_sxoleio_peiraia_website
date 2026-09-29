"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** top-28 (7rem = 112px) + 24px ανάσα κάτω. */
const STICKY_SPACE = 136;

/**
 * Πλαϊνή στήλη της αρχικής που «κολλάει» στο scroll ΜΟΝΟ όταν χωράει
 * ολόκληρη στην οθόνη. Αλλιώς, με position: sticky, ό,τι περισσεύει
 * κάτω θα έμενε κρυμμένο μέχρι το τέλος της σελίδας.
 */
export default function StickyRail({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [fits, setFits] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setFits(el.offsetHeight + STICKY_SPACE <= window.innerHeight);
    // Ο ResizeObserver καλεί το check αμέσως, και ξανά όταν αλλάζει το ύψος
    // (π.χ. όταν τα widgets περάσουν από σκελετό σε περιεχόμενο).
    const observer = new ResizeObserver(check);
    observer.observe(el);
    window.addEventListener("resize", check);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <aside ref={ref} className={className + (fits ? " lg:sticky lg:top-28" : "")}>
      {children}
    </aside>
  );
}
