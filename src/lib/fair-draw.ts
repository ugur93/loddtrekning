import type { PoolTicket, Winner } from "@/lib/types";

export type DrawMode = "balanced" | "random";

type Past = Pick<Winner, "colorName" | "letter" | "number">;
type Ticket = Pick<PoolTicket, "colorName" | "letter" | "number">;

/** Weight multiplier per win above a group's fair share. */
const OVER_SHARE = 0.2;
/** Extra damping when a group also won the previous draw (scaled by how small it is). */
const REPEAT = 0.65;
/** Outside a streak block, no ticket drops below this fraction of a normal ticket's chance. */
const FLOOR = 0.02;

const dimensions: ((t: Ticket) => string)[] = [
  (t) => `c:${t.colorName.trim().toUpperCase()}`,
  (t) => `l:${t.letter.trim().toUpperCase()}`,
  (t) => `n:${t.number}`,
];

/** Unbiased index in [0, length). */
export function randomIndex(length: number) {
  if (length <= 0) return 0;
  const max = 0x1_0000_0000;
  const limit = max - (max % length);
  const buf = new Uint32Array(1);
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0]!;
  } while (x >= limit);
  return x % length;
}

/** Uniform float in [0, 1) with 53 bits of crypto randomness. */
export function randomUnit() {
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  return (buf[0]! * 2 ** 21 + (buf[1]! >>> 11)) / 2 ** 53;
}

/**
 * Balanced weights: each ticket starts at 1. For its color, letter and number,
 * the weight drops for every win that group has above its fair share
 * (its share of all sold tickets), and a bit more if it won the last draw.
 * Groups that have not had their share yet stay at full weight.
 */
export function drawWeights(pool: Ticket[], winners: Past[]): number[] {
  const total = pool.length + winners.length;
  const k = winners.length;
  const last = winners[0];
  const factor = new Map<string, number>();

  for (const keyOf of dimensions) {
    const sold = new Map<string, number>();
    const wins = new Map<string, number>();
    for (const t of pool) sold.set(keyOf(t), (sold.get(keyOf(t)) ?? 0) + 1);
    for (const w of winners) {
      sold.set(keyOf(w), (sold.get(keyOf(w)) ?? 0) + 1);
      wins.set(keyOf(w), (wins.get(keyOf(w)) ?? 0) + 1);
    }
    const lastKey = last ? keyOf(last) : null;
    for (const [key, count] of sold) {
      const share = count / total;
      const excess = (wins.get(key) ?? 0) - (k + 1) * share;
      let f = excess > 0 ? OVER_SHARE ** excess : 1;
      if (key === lastKey) f *= 1 - REPEAT * (1 - share);
      factor.set(key, f);
    }
  }

  const weights = pool.map((t) => {
    let w = 1;
    for (const keyOf of dimensions) w *= factor.get(keyOf(t)) ?? 1;
    return Math.max(FLOOR, w);
  });

  // A color or letter that won the last two draws sits out the next one,
  // unless nothing else is left.
  const blocked = streakKeys(winners);
  if (blocked.length === 0) return weights;
  const open = pool.map((t) => !blocked.some((key) => streakDimensions.some((k) => k(t) === key)));
  return open.some(Boolean) ? weights.map((w, i) => (open[i] ? w : 0)) : weights;
}

const streakDimensions = dimensions.slice(0, 2);

/** Color and letter keys shared by the two latest winners. */
function streakKeys(winners: Past[]) {
  const [newest, previous] = winners;
  if (!newest || !previous) return [];
  return streakDimensions.map((k) => k(newest)).filter((key, i) => key === streakDimensions[i]!(previous));
}

export function pickIndex(pool: Ticket[], winners: Past[], mode: DrawMode): number {
  if (pool.length === 0) return -1;
  if (mode === "random") return randomIndex(pool.length);
  const weights = drawWeights(pool, winners);
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = randomUnit() * sum;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]!;
    if (r < 0) return i;
  }
  return weights.length - 1;
}

/** Chance per color for the next draw, largest first. */
export function colorChances<T extends Ticket & { colorHex: string }>(
  pool: T[],
  winners: Past[],
  mode: DrawMode,
) {
  const weights = mode === "random" ? pool.map(() => 1) : drawWeights(pool, winners);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const byColor = new Map<string, { colorName: string; colorHex: string; chance: number }>();
  pool.forEach((t, i) => {
    const id = t.colorName.trim().toUpperCase();
    const row = byColor.get(id) ?? { colorName: t.colorName, colorHex: t.colorHex, chance: 0 };
    row.chance += weights[i]! / sum;
    byColor.set(id, row);
  });
  return [...byColor.values()].sort((a, b) => b.chance - a.chance);
}
