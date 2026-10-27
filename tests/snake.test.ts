import { describe, expect, it } from "vitest";
import { chooseDirection, createSnake, directionFromKey, placeFood, step, type SnakeState } from "@/lib/snake";

const fixed = () => 0;
function withFood(state: SnakeState, x: number, y: number): SnakeState {
  return { ...state, food: { x, y } };
}

describe("snake", () => {
  it("starts alive, facing right, with food on a free cell", () => {
    const s = createSnake(10, 10, false, fixed);
    expect(s.alive).toBe(true);
    expect(s.body).toHaveLength(4);
    expect(s.body.some((c) => c.x === s.food.x && c.y === s.food.y)).toBe(false);
  });

  it("moves one cell per step without growing", () => {
    const s = withFood(createSnake(10, 10, false), 0, 0);
    const next = step(s);
    expect(next.body[0]).toEqual({ x: s.body[0]!.x + 1, y: s.body[0]!.y });
    expect(next.body).toHaveLength(s.body.length);
  });

  it("grows and scores when it eats", () => {
    const s = createSnake(10, 10, false);
    const head = s.body[0]!;
    const next = step(withFood(s, head.x + 1, head.y), "right", fixed);
    expect(next.body).toHaveLength(s.body.length + 1);
    expect(next.score).toBe(1);
  });

  it("ignores an instant reverse", () => {
    const s = withFood(createSnake(10, 10, false), 0, 0);
    expect(step(s, "left").direction).toBe("right");
  });

  it("dies at a wall unless edges wrap", () => {
    let walled = withFood(createSnake(6, 6, false), 0, 0);
    let wrapped = withFood(createSnake(6, 6, true), 0, 0);
    for (let i = 0; i < 6; i++) {
      walled = step(walled, "right");
      wrapped = step(wrapped, "right");
    }
    expect(walled.alive).toBe(false);
    expect(wrapped.alive).toBe(true);
  });

  it("dies when it runs into itself", () => {
    let s: SnakeState = { cols: 10, rows: 10, body: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }], direction: "right", food: { x: 0, y: 0 }, wrap: false, alive: true, score: 0 };
    s = step(s, "down");
    expect(s.alive).toBe(false);
  });

  it("caps length when asked to", () => {
    let s = createSnake(20, 20, true);
    for (let i = 0; i < 50; i++) {
      const head = s.body[0]!;
      s = step(withFood(s, (head.x + 1) % 20, head.y), "right", fixed, 6);
    }
    expect(s.body.length).toBeLessThanOrEqual(6);
  });

  it("autopilot reaches food without dying", () => {
    // Seeded random numbers, so the food appears in the same places on every run.
    let seed = 42;
    const random = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
    let s = createSnake(24, 16, true, random);
    let eaten = 0;
    for (let i = 0; i < 2000 && eaten < 15; i++) {
      const before = s.score;
      s = step(s, chooseDirection(s), random, 14);
      expect(s.alive).toBe(true);
      if (s.score > before) eaten++;
    }
    expect(eaten).toBe(15);
  });

  it("places food only on free cells", () => {
    const body = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
    for (let i = 0; i < 20; i++) {
      const food = placeFood({ cols: 3, rows: 2, body });
      expect(food.y).toBe(1);
    }
  });

  it("maps keys to directions", () => {
    expect(directionFromKey("ArrowUp")).toBe("up");
    expect(directionFromKey("d")).toBe("right");
    expect(directionFromKey("x")).toBeNull();
  });
});
