// Snake game logic for the playable version in the Lab. Pure functions over plain data, so it's
// deterministic and unit-tested.

export interface Cell {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

export interface SnakeState {
  cols: number;
  rows: number;
  /** Head first. */
  body: Cell[];
  direction: Direction;
  food: Cell;
  /** Edges wrap around, or end the game (the "walls" setting). */
  wrap: boolean;
  alive: boolean;
  score: number;
}

const vectors: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const opposite: Record<Direction, Direction> = { up: "down", down: "up", left: "right", right: "left" };

const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

export function createSnake(cols: number, rows: number, wrap: boolean, random: () => number = Math.random, length = 4): SnakeState {
  const y = Math.floor(rows / 2);
  const x0 = Math.max(length, Math.floor(cols / 3));
  const body = Array.from({ length }, (_, i) => ({ x: x0 - i, y }));
  const state: SnakeState = { cols, rows, body, direction: "right", food: { x: 0, y: 0 }, wrap, alive: true, score: 0 };
  return { ...state, food: placeFood(state, random) };
}

/** A random free cell for the food. */
export function placeFood(state: Pick<SnakeState, "cols" | "rows" | "body">, random: () => number = Math.random): Cell {
  const free: Cell[] = [];
  for (let y = 0; y < state.rows; y++) {
    for (let x = 0; x < state.cols; x++) {
      if (!state.body.some((c) => c.x === x && c.y === y)) free.push({ x, y });
    }
  }
  return free[Math.floor(random() * free.length)] ?? { x: 0, y: 0 };
}

function nextCell(state: SnakeState, direction: Direction): Cell | null {
  const head = state.body[0]!;
  const v = vectors[direction];
  let x = head.x + v.x;
  let y = head.y + v.y;
  if (state.wrap) {
    x = (x + state.cols) % state.cols;
    y = (y + state.rows) % state.rows;
  } else if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) {
    return null;
  }
  return { x, y };
}

/** Would moving this way hit a wall or the body? (The tail cell is free: it moves out of the way.) */
function blocked(state: SnakeState, direction: Direction): boolean {
  const cell = nextCell(state, direction);
  if (!cell) return true;
  return state.body.slice(0, -1).some((c) => same(c, cell));
}

/**
 * Advance one tick in `direction` (ignored if it would reverse the snake onto itself).
 * `maxLength` caps growth.
 */
export function step(state: SnakeState, direction: Direction = state.direction, random: () => number = Math.random, maxLength = Infinity): SnakeState {
  if (!state.alive) return state;
  const dir = direction === opposite[state.direction] && state.body.length > 1 ? state.direction : direction;
  if (blocked(state, dir)) return { ...state, direction: dir, alive: false };

  const head = nextCell(state, dir)!;
  const ate = same(head, state.food);
  let body = [head, ...state.body];
  if (!ate || body.length > maxLength) body = body.slice(0, -1);
  if (body.length > maxLength) body = body.slice(0, maxLength);

  const next: SnakeState = { ...state, body, direction: dir, score: state.score + (ate ? 1 : 0) };
  return ate ? { ...next, food: placeFood(next, random) } : next;
}

/** Shortest signed distance on a ring of `size` cells (or plain difference without wrapping). */
function delta(from: number, to: number, size: number, wrap: boolean): number {
  const d = to - from;
  if (!wrap) return d;
  if (d > size / 2) return d - size;
  if (d < -size / 2) return d + size;
  return d;
}

/**
 * A simple autopilot: head towards the food, never into itself.
 * Prefers the axis with the larger gap, then any safe turn; returns the current direction if trapped.
 */
export function chooseDirection(state: SnakeState): Direction {
  const head = state.body[0]!;
  const dx = delta(head.x, state.food.x, state.cols, state.wrap);
  const dy = delta(head.y, state.food.y, state.rows, state.wrap);
  const horizontal: Direction | null = dx > 0 ? "right" : dx < 0 ? "left" : null;
  const vertical: Direction | null = dy > 0 ? "down" : dy < 0 ? "up" : null;
  const preferred = Math.abs(dx) >= Math.abs(dy) ? [horizontal, vertical] : [vertical, horizontal];
  const candidates = [...preferred, state.direction, "up", "down", "left", "right"].filter(
    (d): d is Direction => d !== null && d !== opposite[state.direction],
  );
  return candidates.find((d) => !blocked(state, d)) ?? state.direction;
}

export function directionFromKey(key: string): Direction | null {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}
