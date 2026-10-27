import { useCallback, useSyncExternalStore } from "react";
import { readNumber, writeNumber } from "./storage";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** A number remembered in localStorage (e.g. a best score). It is null on the server or when nothing is stored. */
export function useStoredNumber(key: string): [number | null, (value: number) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readNumber(key),
    () => null,
  );
  const set = useCallback(
    (next: number) => {
      writeNumber(key, next);
      listeners.forEach((listener) => listener());
    },
    [key],
  );
  return [value, set];
}
