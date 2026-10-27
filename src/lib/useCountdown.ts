import { useEffect, useRef, useState } from "react";

/**
 * Whole seconds left on a countdown that runs while `running` is true. Changing `resetKey` restarts it from
 * `seconds`. It is based on a deadline rather than counting ticks, so a slow or backgrounded tab can't stretch
 * the time, and it stops completely when `running` turns false (an answered question, a finished game).
 */
export function useCountdown(seconds: number, running: boolean, resetKey: unknown, onExpire: () => void): number {
  const [left, setLeft] = useState(seconds);
  const expire = useRef(onExpire);
  useEffect(() => {
    expire.current = onExpire;
  });

  // Restart from the full time for each new question.
  const [key, setKey] = useState(resetKey);
  if (key !== resetKey) {
    setKey(resetKey);
    setLeft(seconds);
  }

  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(id);
        expire.current();
      }
    }, 250);
    return () => window.clearInterval(id);
    // `left` is read once when the countdown (re)starts; including it would restart the interval every second.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, resetKey]);

  return left;
}
