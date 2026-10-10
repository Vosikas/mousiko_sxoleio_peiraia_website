"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { DICTIONARY } from "@/i18n/dictionary";
import { fill, type L, type Lang } from "@/i18n/l10n";

export type Language = Lang;

type Vars = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Κείμενο interface: ελληνικά → αγγλικά από το λεξικό (src/i18n/dictionary.ts). */
  t: (greek: string, vars?: Vars) => string;
  /** Κείμενο περιεχομένου (L): το `en` του, αλλιώς το λεξικό, αλλιώς τα ελληνικά. */
  l: (value: L, vars?: Vars) => string;
};

/* ---------------------------------------------------------------------------
 * Η επιλεγμένη γλώσσα ζει στο localStorage — εξωτερική πηγή, όχι state του
 * React. Ο server αποδίδει πάντα ελληνικά· μετά το hydration ο browser
 * περνάει στη γλώσσα που είχε διαλέξει ο επισκέπτης.
 * ------------------------------------------------------------------------- */

const KEY = "msp:language";
const listeners = new Set<() => void>();

function readLanguage(): Language {
  try {
    return window.localStorage.getItem(KEY) === "EN" ? "EN" : "GR";
  } catch {
    return "GR";
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  // Αλλαγή γλώσσας σε άλλη καρτέλα του ίδιου site.
  const onStorage = (event: StorageEvent) => event.key === KEY && callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function writeLanguage(language: Language) {
  try {
    window.localStorage.setItem(KEY, language);
  } catch {
    /* χωρίς storage η επιλογή απλώς δεν θυμάται */
  }
  for (const listener of listeners) listener();
}

const serverLanguage = (): Language => "GR";

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, readLanguage, serverLanguage);

  // Συγχρονισμός με το DOM (εξωτερικό σύστημα): <html lang="…">.
  useEffect(() => {
    document.documentElement.lang = language === "EN" ? "en" : "el";
  }, [language]);

  const t = useCallback(
    (greek: string, vars?: Vars) => fill(language === "EN" ? (DICTIONARY[greek] ?? greek) : greek, vars),
    [language],
  );

  const l = useCallback(
    (value: L, vars?: Vars) =>
      typeof value === "string" ? t(value, vars) : fill(language === "EN" ? value.en : value.el, vars),
    [language, t],
  );

  const context = useMemo(() => ({ language, setLanguage: writeLanguage, t, l }), [language, t, l]);

  return <LanguageContext.Provider value={context}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
