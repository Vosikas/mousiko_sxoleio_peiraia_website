"use client";

import { useSyncExternalStore } from "react";

/**
 * Η τρέχουσα ώρα ως εξωτερική πηγή δεδομένων.
 *
 * Ο server δεν έχει ώρα επισκέπτη, οπότε το server snapshot είναι `null`
 * και τα widgets δείχνουν σκελετό μέχρι το hydration — χωρίς mismatch και
 * χωρίς setState μέσα σε effect.
 */

type Store = { subscribe: (cb: () => void) => () => void; getSnapshot: () => number };

const stores = new Map<number, Store>();
const serverSnapshot = () => null;

function getStore(intervalMs: number): Store {
  const cached = stores.get(intervalMs);
  if (cached) return cached;

  const listeners = new Set<() => void>();
  let snapshot = Date.now();
  let timer: ReturnType<typeof setInterval> | null = null;

  const store: Store = {
    subscribe(cb) {
      listeners.add(cb);
      if (!timer) {
        snapshot = Date.now();
        timer = setInterval(() => {
          snapshot = Date.now();
          for (const l of listeners) l();
        }, intervalMs);
      }
      return () => {
        listeners.delete(cb);
        if (listeners.size === 0 && timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    getSnapshot: () => snapshot,
  };

  stores.set(intervalMs, store);
  return store;
}

/** Επιστρέφει `null` στον server και στο πρώτο render, μετά ζωντανή ώρα. */
export function useNow(intervalMs = 1000): Date | null {
  const store = getStore(intervalMs);
  const ms = useSyncExternalStore(store.subscribe, store.getSnapshot, serverSnapshot);
  return ms === null ? null : new Date(ms);
}
