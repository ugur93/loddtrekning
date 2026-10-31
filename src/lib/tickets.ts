import { colorFromName, hexForColorName } from "@/lib/colors";
import { pickIndex, type DrawMode } from "@/lib/fair-draw";
import type { PoolTicket, TicketBook, Winner } from "@/lib/types";

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ".split("");
export const BOOK_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXY".split("");

export function ticketKey(bookId: string, number: number) {
  return `${bookId}:${number}`;
}

/** Ticket numbers are printed with two digits: 01, 02 … 25. */
export function formatNumber(number: number) {
  return String(number).padStart(2, "0");
}

export function formatTicket(colorName: string, letter: string, number: number) {
  return `${colorName} ${letter} ${formatNumber(number)}`;
}

export function expandPool(books: TicketBook[], drawnKeys: Iterable<string>): PoolTicket[] {
  const drawn = drawnKeys instanceof Set ? drawnKeys : new Set(drawnKeys);
  const pool: PoolTicket[] = [];
  for (const book of books) {
    for (let n = book.from; n <= book.to; n++) {
      const key = ticketKey(book.id, n);
      if (drawn.has(key)) continue;
      pool.push({
        key,
        bookId: book.id,
        colorName: book.colorName,
        colorHex: book.colorHex,
        letter: book.letter,
        number: n,
      });
    }
  }
  return pool;
}

type NewBook = Omit<TicketBook, "id">;

/**
 * Drops numbers that already exist for the same color + letter (also within
 * the new batch), so a ticket can never be in the draw twice. Partly
 * overlapping ranges are split into the free parts.
 */
export function withoutDuplicates(existing: TicketBook[], incoming: NewBook[]) {
  const key = (b: { colorName: string; letter: string }) =>
    `${b.colorName.trim().toUpperCase()}|${b.letter.trim().toUpperCase()}`;
  const taken = new Map<string, Set<number>>();
  const takenFor = (b: { colorName: string; letter: string }) => {
    const k = key(b);
    if (!taken.has(k)) taken.set(k, new Set());
    return taken.get(k)!;
  };
  for (const b of existing) {
    const set = takenFor(b);
    for (let n = b.from; n <= b.to; n++) set.add(n);
  }
  const books: NewBook[] = [];
  let added = 0;
  let skipped = 0;
  for (const b of incoming) {
    const set = takenFor(b);
    let runFrom: number | null = null;
    for (let n = b.from; n <= b.to + 1; n++) {
      const free = n <= b.to && !set.has(n);
      if (free) {
        set.add(n);
        added += 1;
        runFrom ??= n;
      } else {
        if (n <= b.to) skipped += 1;
        if (runFrom !== null) books.push({ ...b, from: runFrom, to: n - 1 });
        runFrom = null;
      }
    }
  }
  return { books, added, skipped };
}

export function remainingInBook(book: TicketBook, drawnKeys: Iterable<string>) {
  const drawn = drawnKeys instanceof Set ? drawnKeys : new Set(drawnKeys);
  let count = 0;
  for (let n = book.from; n <= book.to; n++) {
    if (!drawn.has(ticketKey(book.id, n))) count += 1;
  }
  return count;
}

export function bookSize(book: Pick<TicketBook, "from" | "to">) {
  return Math.max(0, book.to - book.from + 1);
}

export function pickTicket(
  pool: PoolTicket[],
  winners: Pick<Winner, "colorName" | "letter" | "number">[],
  mode: DrawMode,
): PoolTicket | null {
  return pool[pickIndex(pool, winners, mode)] ?? null;
}

export function winnerFromTicket(
  ticket: PoolTicket,
  prize?: { name?: string; imageDataUrl?: string },
): Winner {
  return {
    id: crypto.randomUUID(),
    drawnAt: Date.now(),
    bookId: ticket.bookId,
    colorName: ticket.colorName,
    colorHex: ticket.colorHex,
    letter: ticket.letter,
    number: ticket.number,
    prizeName: prize?.name?.trim() || undefined,
    prizeImage: prize?.imageDataUrl || undefined,
  };
}

export type ParsedBookLine = {
  colorName: string;
  letter: string;
  from: number;
  to: number;
};

/** "A", "A-Y" or "A,C,F-H" → letters. Ranges only within BOOK_LETTERS / LETTERS. */
export function parseLetters(spec: string): string[] | null {
  const out: string[] = [];
  for (const part of spec.toUpperCase().split(",")) {
    const p = part.trim();
    if (!p) continue;
    const range = p.match(/^(\p{L})\s*[-–—]\s*(\p{L})$/u);
    if (range) {
      const a = LETTERS.indexOf(range[1]!);
      const b = LETTERS.indexOf(range[2]!);
      if (a < 0 || b < a) return null;
      out.push(...LETTERS.slice(a, b + 1));
    } else if (/^[\p{L}\d]{1,8}$/u.test(p)) {
      out.push(p);
    } else {
      return null;
    }
  }
  return out.length ? [...new Set(out)] : null;
}

/** "1-100", "7" or "1-20, 25, 30-40" → ranges. */
export function parseNumbers(spec: string): [number, number][] | null {
  const out: [number, number][] = [];
  for (const part of spec.split(",")) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)(?:\s*(?:[-–—]|to|til)\s*(\d+))?$/i);
    if (!m) return null;
    const from = Number(m[1]);
    const to = m[2] ? Number(m[2]) : from;
    if (from < 1 || to < from || to > 9999) return null;
    out.push([from, to]);
  }
  return out.length ? out : null;
}

/** Color words meaning "all four book colors". */
const ALL_COLORS_WORDS = ["alle", "all", "tümü", "tumu", "hepsi"];

/** "Rosa A 1-25", "Alle A-C 1-25", "Gul B,C 1-10, 12" → one row per color, letter and range. */
export function parseBookLine(line: string): ParsedBookLine[] {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return [];
  const match = trimmed.match(/^(.+?)\s+(\p{L}(?:\s*[-–—,]\s*\p{L})*|[\p{L}\d]{1,8})\s+(\d[\d\s,–—-]*|\d+\s*(?:to|til)\s*\d+)$/iu);
  if (!match) return [];
  const colorName = match[1]!.trim();
  const letters = parseLetters(match[2]!);
  const ranges = parseNumbers(match[3]!);
  if (!colorName || !letters || !ranges) return [];
  const colors = ALL_COLORS_WORDS.includes(colorName.toLocaleLowerCase("nb"))
    ? [...BOOK_COLORS]
    : [colorName];
  return letters.flatMap((letter) =>
    colors.flatMap((name) => ranges.map(([from, to]) => ({ colorName: name, letter, from, to }))),
  );
}

export function parseBookLines(text: string): ParsedBookLine[] {
  return text.split(/\n+/).flatMap(parseBookLine);
}

export function bookFromParsed(parsed: ParsedBookLine): TicketBook {
  const known = colorFromName(parsed.colorName);
  return {
    id: crypto.randomUUID(),
    colorName: known?.name ?? parsed.colorName,
    colorHex: known?.hex ?? hexForColorName(parsed.colorName),
    letter: parsed.letter,
    from: parsed.from,
    to: Math.min(parsed.to, 9999),
  };
}

/** The four colors in a standard loddbok (Europris «Loddbok A–Y»). */
export const BOOK_COLORS = ["Rosa", "Grønn", "Gul", "Blå"] as const;
export const BOOK_FROM = 1;
export const BOOK_TO = 25;

export const EXAMPLE_BOOKS: Omit<TicketBook, "id">[] = ["A", "B"].flatMap((letter) =>
  BOOK_COLORS.map((colorName) => ({
    colorName,
    colorHex: hexForColorName(colorName),
    letter,
    from: BOOK_FROM,
    to: BOOK_TO,
  })),
);
