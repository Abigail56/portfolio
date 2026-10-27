import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play, RotateCcw, Settings2 } from "lucide-react";
import { createSnake, directionFromKey, opposite, step, type Cell, type Direction, type SnakeState } from "@/lib/snake";
import { formatDuration } from "@/lib/games";
import { useStoredNumber } from "@/lib/useStoredNumber";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";

const COLS = 20;
const ROWS = 20;
const MIN_MS = 65;
const START_LENGTH = 4;

const SPEEDS = {
  relaxed: { label: "Relaxed", ms: 170 },
  classic: { label: "Classic", ms: 125 },
  fast: { label: "Fast", ms: 90 },
} as const;
type Speed = keyof typeof SPEEDS;
type Phase = "setup" | "ready" | "playing" | "paused" | "over";

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}
interface Popup {
  x: number;
  y: number;
  life: number;
}

export function SnakeGame() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [speed, setSpeed] = useState<Speed>("classic");
  const [walls, setWalls] = useState(true);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [best, setBest] = useStoredNumber(`snake-best-${speed}-${walls ? "walls" : "wrap"}`);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<SnakeState | null>(null);
  const prevBodyRef = useRef<Cell[]>([]);
  const queued = useRef<Direction[]>([]);
  const sparks = useRef<Spark[]>([]);
  const popups = useRef<Popup[]>([]);
  const lastTick = useRef(0);
  const playedMs = useRef(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  // The animation loop and input handlers read the phase through a ref, so they always see the latest value.
  const phaseRef = useRef<Phase>("setup");
  const go = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);
  const isSetup = phase === "setup";

  const start = useCallback(() => {
    const state = createSnake(COLS, ROWS, !walls, Math.random, START_LENGTH);
    stateRef.current = state;
    prevBodyRef.current = state.body;
    queued.current = [];
    sparks.current = [];
    popups.current = [];
    playedMs.current = 0;
    setScore(0);
    setElapsed(0);
    go("ready");
    requestAnimationFrame(() => canvasRef.current?.focus());
  }, [walls, go]);

  const turn = useCallback((d: Direction) => {
    const p = phaseRef.current;
    if (p === "ready") {
      // The first move starts the game, unless it would reverse straight into the body.
      const current = stateRef.current?.direction;
      if (current && d === opposite[current]) return;
      queued.current = [d];
      lastTick.current = performance.now();
      go("playing");
      return;
    }
    if (p !== "playing") return;
    // Queue up to two turns so quick key presses between ticks aren't lost.
    const lastQueued = queued.current[queued.current.length - 1] ?? stateRef.current?.direction;
    if (queued.current.length < 2 && d !== lastQueued) queued.current.push(d);
  }, [go]);

  // One animation loop draws every frame (so movement is smooth) and advances the game on each tick.
  useEffect(() => {
    if (isSetup) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Each tick gets a little shorter as the score grows.
    const interval = (points: number) => Math.max(MIN_MS, SPEEDS[speed].ms - points * 2);
    let raf = 0;
    let shownSeconds = -1;
    let colors: Record<string, string> = {};
    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      colors = Object.fromEntries(
        ["--surface", "--surface-2", "--line", "--accent", "--brand-3", "--brand-4", "--brand-5", "--fg"].map((v) => [v, css.getPropertyValue(v).trim()]),
      );
    };
    readColors();
    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const mix = (a: string, b: string, t: number) => {
      const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
      const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
      return `rgb(${pa.map((v, i) => Math.round(v + ((pb[i] ?? v) - v) * t)).join(",")})`;
    };

    let lastFrame = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      let state = stateRef.current;
      if (!state) return;

      if (phaseRef.current === "playing") {
        playedMs.current += dt * 1000;
        const ms = interval(state.score);
        if (now - lastTick.current >= ms) {
          lastTick.current = now;
          prevBodyRef.current = state.body;
          const next = step(state, queued.current.shift() ?? state.direction);
          stateRef.current = next;
          if (next.score > state.score) {
            const cx = (state.food.x + 0.5) / COLS;
            const cy = (state.food.y + 0.5) / ROWS;
            for (let i = 0; i < 14; i++) {
              const a = (i / 14) * Math.PI * 2;
              const v = 0.15 + Math.random() * 0.25;
              sparks.current.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 });
            }
            popups.current.push({ x: cx, y: cy, life: 1 });
            setScore(next.score);
          }
          if (!next.alive) {
            go("over");
            if (best === null || next.score > best) setBest(next.score);
          }
          state = next;
        }
        const seconds = Math.floor(playedMs.current / 1000);
        if (seconds !== shownSeconds) {
          shownSeconds = seconds;
          setElapsed(seconds);
        }
      }

      // Size the canvas to its box and the screen's pixel density.
      const size = canvas.clientWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(size * dpr)) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cell = size / COLS;

      // Board: a soft checkerboard.
      ctx.fillStyle = colors["--surface-2"] ?? "#eef1f7";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = colors["--surface"] ?? "#ffffff";
      ctx.globalAlpha = 0.45;
      for (let y = 0; y < ROWS; y++) for (let x = (y % 2); x < COLS; x += 2) ctx.fillRect(x * cell, y * cell, cell, cell);
      ctx.globalAlpha = 1;

      // Food: a glowing fruit with a leaf.
      const pulse = 1 + Math.sin(now / 220) * 0.08;
      const fx = (state.food.x + 0.5) * cell;
      const fy = (state.food.y + 0.5) * cell;
      ctx.fillStyle = colors["--brand-4"] ?? "#c9851a";
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.arc(fx, fy, cell * 0.62 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(fx, fy, cell * 0.32 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors["--brand-5"] ?? "#0f8a7e";
      ctx.beginPath();
      ctx.ellipse(fx + cell * 0.12, fy - cell * 0.32, cell * 0.12, cell * 0.06, -0.6, 0, Math.PI * 2);
      ctx.fill();

      // Snake: each segment slides from its previous cell to its new one between ticks.
      const t = phaseRef.current === "playing" ? Math.min(1, (now - lastTick.current) / interval(state.score)) : 1;
      const prev = prevBodyRef.current;
      const points = state.body.map((c, i) => {
        const p = prev[i] ?? prev[prev.length - 1] ?? c;
        const jump = Math.abs(p.x - c.x) > 1 || Math.abs(p.y - c.y) > 1; // wrapped across an edge: don't slide
        const ix = jump ? c.x : p.x + (c.x - p.x) * t;
        const iy = jump ? c.y : p.y + (c.y - p.y) * t;
        return { x: (ix + 0.5) * cell, y: (iy + 0.5) * cell };
      });
      const head = colors["--accent"] ?? "#2f4bc8";
      const tail = colors["--brand-3"] ?? "#0e7fb8";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = cell * 0.74;
      for (let i = points.length - 1; i > 0; i--) {
        const a = points[i]!;
        const b = points[i - 1]!;
        if (Math.abs(a.x - b.x) > cell * 1.5 || Math.abs(a.y - b.y) > cell * 1.5) continue;
        ctx.strokeStyle = mix(head, tail, i / Math.max(1, points.length - 1));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      const h = points[0]!;
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(h.x, h.y, cell * 0.44, 0, Math.PI * 2);
      ctx.fill();
      const angle = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }[state.direction];
      for (const side of [-1, 1]) {
        const ex = h.x + Math.cos(angle) * cell * 0.14 + Math.cos(angle + (side * Math.PI) / 2) * cell * 0.2;
        const ey = h.y + Math.sin(angle) * cell * 0.14 + Math.sin(angle + (side * Math.PI) / 2) * cell * 0.2;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(ex, ey, cell * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(ex + Math.cos(angle) * cell * 0.04, ey + Math.sin(angle) * cell * 0.04, cell * 0.06, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks and "+1" popups from the last bite.
      sparks.current = sparks.current.filter((s) => (s.life -= dt * 1.8) > 0);
      ctx.fillStyle = colors["--brand-4"] ?? "#c9851a";
      for (const s of sparks.current) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x * size, s.y * size, cell * 0.09, 0, Math.PI * 2);
        ctx.fill();
      }
      popups.current = popups.current.filter((p) => (p.life -= dt * 1.2) > 0);
      ctx.fillStyle = colors["--fg"] ?? "#0f172a";
      ctx.font = `600 ${Math.round(cell * 0.7)}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      for (const p of popups.current) {
        ctx.globalAlpha = p.life;
        ctx.fillText("+1", p.x * size, p.y * size - (1 - p.life) * cell * 1.5);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isSetup, speed, best, setBest, go]);

  // Keyboard: arrows or WASD to steer, Space to pause, Enter to play again.
  useEffect(() => {
    if (phase === "setup") return;
    const onKey = (e: KeyboardEvent) => {
      const d = directionFromKey(e.key);
      if (d && (phase === "ready" || phase === "playing")) {
        e.preventDefault();
        turn(d);
      } else if (e.key === " " && (phase === "playing" || phase === "paused")) {
        e.preventDefault();
        if (phase === "paused") lastTick.current = performance.now();
        go(phase === "playing" ? "paused" : "playing");
      } else if (e.key === "Enter" && phase === "over") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, turn, start, go]);

  // Pause automatically when the tab is hidden.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && phaseRef.current === "playing") go("paused");
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [go]);

  const resume = () => {
    lastTick.current = performance.now();
    go("playing");
  };

  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl glass-card p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-semibold text-fg">Set up your game</h2>
        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-fg">Speed</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(Object.keys(SPEEDS) as Speed[]).map((s) => (
              <label
                key={s}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  speed === s ? "border-accent bg-accent-soft font-medium text-fg" : "border-line text-muted hover:border-line-strong",
                )}
              >
                <input type="radio" name="speed" value={s} checked={speed === s} onChange={() => setSpeed(s)} className="sr-only" />
                {SPEEDS[s].label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-fg">Edges</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { value: true, label: "Solid walls" },
              { value: false, label: "Wrap around" },
            ].map((o) => (
              <label
                key={o.label}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent",
                  walls === o.value ? "border-accent bg-accent-soft font-medium text-fg" : "border-line text-muted hover:border-line-strong",
                )}
              >
                <input type="radio" name="edges" checked={walls === o.value} onChange={() => setWalls(o.value)} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
        <ul className="mt-6 grid gap-1.5 text-sm text-muted">
          <li>Steer with the arrow keys or W A S D. Space pauses.</li>
          <li>On a phone, swipe on the board or use the buttons.</li>
          <li>Each fruit is a point, and the snake speeds up as it grows.</li>
        </ul>
        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-sm text-subtle">Best ({SPEEDS[speed].label.toLowerCase()}, {walls ? "walls" : "wrap"}): {best ?? 0}</p>
          <Button onClick={start}>Start game</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-3 grid grid-cols-3 items-center text-sm">
        <span className="text-muted">
          Score <span className="text-base font-semibold text-fg tabular-nums">{score}</span>
        </span>
        <span className="text-center text-muted tabular-nums">{formatDuration(elapsed)}</span>
        <span className="text-right text-muted">
          Best <span className="font-semibold text-fg tabular-nums">{Math.max(best ?? 0, score)}</span>
        </span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          aria-label={`Snake board. Score ${score}. Use the arrow keys to steer and Space to pause.`}
          className="aspect-square w-full touch-none rounded-2xl border border-line shadow-md"
          onTouchStart={(e) => {
            const t = e.touches[0];
            if (t) touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const s = touchStart.current;
            const t = e.changedTouches[0];
            if (!s || !t) return;
            const dx = t.clientX - s.x;
            const dy = t.clientY - s.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
            turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
          }}
        />

        {phase === "ready" && (
          <p className="pointer-events-none absolute inset-x-0 bottom-5 mx-auto w-fit rounded-xl bg-surface px-5 py-3 text-center text-sm font-medium text-fg shadow-md" aria-live="polite">
            Press an arrow key or swipe to start
          </p>
        )}
        {(phase === "paused" || phase === "over") && (
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] p-4 backdrop-blur-[2px]" aria-live="polite">
            {phase === "paused" && (
              <div className="rounded-2xl bg-surface p-6 text-center shadow-lg">
                <p className="text-lg font-semibold text-fg">Paused</p>
                <Button className="mt-4" onClick={resume}>
                  <Play aria-hidden className="size-4" />
                  Resume
                </Button>
              </div>
            )}
            {phase === "over" && (
              <div className="w-full max-w-xs rounded-2xl bg-surface p-6 text-center shadow-lg">
                <p className="text-sm font-medium text-subtle">Game over</p>
                <p className="mt-1 text-4xl font-bold text-fg tabular-nums">{score}</p>
                {score > 0 && best !== null && score >= best && <p className="mt-1 text-sm font-medium text-success">New best score</p>}
                <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-surface-2 py-2">
                    <dt className="text-subtle">Length</dt>
                    <dd className="font-semibold text-fg">{START_LENGTH + score}</dd>
                  </div>
                  <div className="rounded-lg bg-surface-2 py-2">
                    <dt className="text-subtle">Time</dt>
                    <dd className="font-semibold text-fg">{formatDuration(elapsed)}</dd>
                  </div>
                </dl>
                <div className="mt-5 grid gap-2">
                  <Button onClick={start}>
                    <RotateCcw aria-hidden className="size-4" />
                    Play again
                  </Button>
                  <Button variant="secondary" onClick={() => go("setup")}>
                    <Settings2 aria-hidden className="size-4" />
                    Change settings
                  </Button>
                </div>
                <p className="mt-3 text-xs text-subtle">Press Enter to play again</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="grid grid-cols-3 gap-1.5" aria-label="Direction buttons">
          <span />
          <Button variant="secondary" aria-label="Up" onClick={() => turn("up")}>
            <ArrowUp aria-hidden className="size-4" />
          </Button>
          <span />
          <Button variant="secondary" aria-label="Left" onClick={() => turn("left")}>
            <ArrowLeft aria-hidden className="size-4" />
          </Button>
          <Button variant="secondary" aria-label="Down" onClick={() => turn("down")}>
            <ArrowDown aria-hidden className="size-4" />
          </Button>
          <Button variant="secondary" aria-label="Right" onClick={() => turn("right")}>
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        </div>
        <div className="flex flex-col items-end gap-2">
          {(phase === "playing" || phase === "paused") && (
            <Button variant="ghost" size="sm" onClick={phase === "playing" ? () => go("paused") : resume}>
              {phase === "playing" ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
              {phase === "playing" ? "Pause" : "Resume"}
            </Button>
          )}
          <ButtonLink href="/playground" variant="ghost" size="sm">
            Back to the Lab
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
