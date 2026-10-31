import assert from "node:assert/strict";
import { test } from "node:test";
import { drawWeights, pickIndex, type DrawMode } from "./fair-draw.ts";

type T = { colorName: string; colorHex: string; letter: string; number: number };

function books(spec: [string, string[], number, number][]): T[] {
  const out: T[] = [];
  for (const [colorName, letters, from, to] of spec) {
    for (const letter of letters) {
      for (let n = from; n <= to; n++) out.push({ colorName, colorHex: "#000", letter, number: n });
    }
  }
  return out;
}

const AY = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("");

function run(all: T[], draws: number, mode: DrawMode) {
  const pool = all.slice();
  const winners: T[] = [];
  for (let i = 0; i < draws && pool.length; i++) {
    const idx = pickIndex(pool, winners, mode);
    const [w] = pool.splice(idx, 1);
    winners.unshift(w!);
  }
  return winners.reverse();
}

function repeatRate(rounds: T[][], key: (t: T) => string) {
  let same = 0;
  let pairs = 0;
  for (const r of rounds) {
    for (let i = 1; i < r.length; i++) {
      pairs++;
      if (key(r[i]!) === key(r[i - 1]!)) same++;
    }
  }
  return same / pairs;
}

test("every ticket keeps a chance", () => {
  const pool = books([["Rød", ["A"], 1, 20], ["Blå", ["A"], 1, 20]]);
  const winners = pool.splice(0, 10); // ten red wins in a row
  for (const w of drawWeights(pool, winners)) assert.ok(w > 0);
});

test("same color or letter never wins three times in a row while others remain", () => {
  const all = books([["Rosa", ["A", "B"], 1, 25], ["Blå", ["A", "B"], 1, 25]]);
  for (let round = 0; round < 200; round++) {
    const w = run(all, 30, "balanced");
    for (let i = 2; i < w.length; i++) {
      for (const key of ["colorName", "letter"] as const) {
        const triple = w[i]![key] === w[i - 1]![key] && w[i]![key] === w[i - 2]![key];
        assert.ok(!triple, `${key} three in a row at draw ${i + 1}`);
      }
    }
  }
});

test("pure random: every color and letter wins its share, also with many letters per color", () => {
  // Uneven book: Rosa has letters A–E, Blå only A, so Rosa is 5/6 of the tickets.
  const all = books([["Rosa", ["A", "B", "C", "D", "E"], 1, 25], ["Blå", ["A"], 1, 25]]);
  const counts = new Map<string, number>();
  const rounds = 4000;
  for (let r = 0; r < rounds; r++) {
    const [w] = run(all, 1, "random");
    for (const key of [`c:${w!.colorName}`, `l:${w!.letter}`, `b:${w!.colorName}${w!.letter}`]) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const share = (key: string) => (counts.get(key) ?? 0) / rounds;
  assert.ok(Math.abs(share("c:Rosa") - 5 / 6) < 0.03, `Rosa ${share("c:Rosa")}`);
  assert.ok(Math.abs(share("l:A") - 2 / 6) < 0.03, `A ${share("l:A")}`);
  for (const book of ["RosaA", "RosaB", "RosaC", "RosaD", "RosaE", "BlåA"]) {
    assert.ok(Math.abs(share(`b:${book}`) - 1 / 6) < 0.025, `${book} ${share(`b:${book}`)}`);
  }
});

test("raffle never stalls and draws every ticket once", () => {
  const all = books([["Rød", AY.slice(0, 5), 1, 4], ["Blå", ["A", "B"], 1, 4]]);
  const winners = run(all, Infinity, "balanced");
  assert.equal(winners.length, all.length);
  assert.equal(new Set(winners.map((w) => `${w.colorName}${w.letter}${w.number}`)).size, all.length);
});

test("balanced: fewer color and letter repeats than pure random, shares stay fair", () => {
  // Four colors A–Y, numbers 1–4 sold, uneven: Rød has twice as many.
  const all = books([
    ["Rød", AY, 1, 4],
    ["Rød", AY, 5, 8],
    ["Blå", AY, 1, 4],
    ["Gul", AY, 1, 4],
    ["Grønn", AY, 1, 4],
  ]);
  const rounds = 400;
  const draws = 15;
  const bal = Array.from({ length: rounds }, () => run(all, draws, "balanced"));
  const rnd = Array.from({ length: rounds }, () => run(all, draws, "random"));
  const color = (t: T) => t.colorName;
  const letter = (t: T) => t.letter;

  const balColor = repeatRate(bal, color);
  const rndColor = repeatRate(rnd, color);
  assert.ok(balColor < rndColor * 0.75, `color repeats ${balColor} vs ${rndColor}`);
  assert.ok(repeatRate(bal, letter) < repeatRate(rnd, letter) * 0.6);

  // Rød is 40% of sold tickets; its share of wins should stay close.
  const red = bal.flat().filter((w) => w.colorName === "Rød").length / (rounds * draws);
  assert.ok(Math.abs(red - 0.4) < 0.04, `red share ${red}`);
});
