import { Trash2 } from "lucide-react";
import { TicketCard } from "@/components/ticket-card";
import { colorLabel } from "@/lib/colors";
import { useI18n, type Locale } from "@/lib/i18n";
import { BOOK_LETTERS, bookSize, formatNumber, remainingInBook } from "@/lib/tickets";
import type { BookGrouping, TicketBook } from "@/lib/types";
import { useRaffleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Row = { key: string; title: string; detail: string; books: TicketBook[]; cards: TicketBook[] };
type Msg = ReturnType<typeof useI18n>["t"];

const letterOrder = (l: string) => {
  const i = BOOK_LETTERS.indexOf(l);
  return i < 0 ? Number.POSITIVE_INFINITY : i;
};

/** Sold numbers as text, with touching ranges joined: 01–17 + 18–20 → "01–20". */
function rangesText(books: TicketBook[]) {
  const sorted = books.map((b) => [b.from, b.to] as const).sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const [from, to] of sorted) {
    const last = merged[merged.length - 1];
    if (last && from <= last[1] + 1) last[1] = Math.max(last[1], to);
    else merged.push([from, to]);
  }
  return merged
    .map(([from, to]) => (from === to ? formatNumber(from) : `${formatNumber(from)}–${formatNumber(to)}`))
    .join(", ");
}

const colorKey = (b: TicketBook) => `${b.colorName.trim().toUpperCase()}|${b.colorHex}`;

/** "A,B,C,D,F" → "A–D, F" using book letter order. */
function compactLetters(letters: string[]) {
  const sorted = [...new Set(letters)].sort(
    (a, b) => letterOrder(a) - letterOrder(b) || a.localeCompare(b),
  );
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && letterOrder(sorted[j + 1]!) === letterOrder(sorted[j]!) + 1) j++;
    parts.push(j - i >= 2 ? `${sorted[i]}–${sorted[j]}` : sorted.slice(i, j + 1).join(", "));
    i = j + 1;
  }
  return parts.join(", ");
}

/** Buckets books by key, keeping first-seen order. */
function bucket(books: TicketBook[], keyOf: (b: TicketBook) => string) {
  const out = new Map<string, TicketBook[]>();
  for (const b of books) out.set(keyOf(b), [...(out.get(keyOf(b)) ?? []), b]);
  return [...out.values()];
}

const byLetter = (a: TicketBook[], b: TicketBook[]) => {
  const la = a[0]!.letter;
  const lb = b[0]!.letter;
  return letterOrder(la) - letterOrder(lb) || la.localeCompare(lb);
};

function buildRows(books: TicketBook[], grouping: BookGrouping, locale: Locale, t: Msg): Row[] {
  const name = (b: TicketBook) => colorLabel(b.colorName, locale);

  if (grouping === "letter") {
    return bucket(books, (b) => b.letter)
      .sort(byLetter)
      .map((rows) => {
        const colors = bucket(rows, colorKey);
        const ranges = new Set(colors.map(rangesText));
        return {
          key: `l:${rows[0]!.letter}`,
          title: t.bookLabel(rows[0]!.letter),
          detail:
            ranges.size === 1
              ? `${[...ranges][0]} · ${colors.map((c) => name(c[0]!)).join(", ")}`
              : colors.map((c) => `${name(c[0]!)} ${rangesText(c)}`).join(" · "),
          books: rows,
          cards: colors.map((c) => c[0]!),
        };
      });
  }

  if (grouping === "color") {
    return bucket(books, colorKey).map((rows) => {
      // Letters that share the same sold numbers are listed together: "A–C 01–25 · D 01–17".
      const letters = bucket(rows, (b) => b.letter);
      const byRanges = new Map<string, string[]>();
      for (const l of letters) {
        const ranges = rangesText(l);
        byRanges.set(ranges, [...(byRanges.get(ranges) ?? []), l[0]!.letter]);
      }
      return {
        key: `c:${colorKey(rows[0]!)}`,
        title: name(rows[0]!),
        detail: [...byRanges].map(([ranges, ls]) => `${compactLetters(ls)} ${ranges}`).join(" · "),
        books: rows,
        cards: letters.sort(byLetter).map((l) => l[0]!),
      };
    });
  }

  return bucket(books, (b) => `${b.letter}|${colorKey(b)}`)
    .sort(byLetter)
    .map((rows) => ({
      key: `n:${rows[0]!.letter}|${colorKey(rows[0]!)}`,
      title: `${name(rows[0]!)} ${rows[0]!.letter}`,
      detail: rangesText(rows),
      books: rows,
      cards: [rows[0]!],
    }));
}

export function BookList() {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const removeBook = useRaffleStore((s) => s.removeBook);
  const grouping = useRaffleStore((s) => s.bookGrouping);
  const setGrouping = useRaffleStore((s) => s.setBookGrouping);
  const { locale, t } = useI18n();

  if (books.length === 0) {
    return <p className="px-1 text-sm text-muted">{t.noBooks}</p>;
  }

  const drawn = new Set(drawnKeys);
  const options: [BookGrouping, string][] = [
    ["none", t.groupNone],
    ["letter", t.groupLetter],
    ["color", t.groupColor],
  ];

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-end gap-2 px-1">
        <span className="text-sm text-muted">{t.groupBy}</span>
        <div role="radiogroup" aria-label={t.groupBy} className="inline-flex rounded-md bg-bg-warm p-0.5">
          {options.map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={grouping === value}
              onClick={() => setGrouping(value)}
              className={cn(
                "h-9 rounded-sm px-3 text-sm",
                grouping === value
                  ? "bg-surface text-fg shadow-[var(--shadow-border)]"
                  : "text-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-2">
        {buildRows(books, grouping, locale, t).map((row) => {
          const left = row.books.reduce((sum, b) => sum + remainingInBook(b, drawn), 0);
          const total = row.books.reduce((sum, b) => sum + bookSize(b), 0);
          return (
            <li
              key={row.key}
              className="flex items-center gap-3 rounded-lg bg-surface p-2 pl-2.5 shadow-[var(--shadow-border)]"
            >
              <div className="flex shrink-0 -space-x-[6.5rem] pr-1" aria-hidden>
                {row.cards.slice(0, 4).map((c, i, shown) => (
                  <div
                    key={c.id}
                    style={{ transform: `translateY(${(i - (shown.length - 1) / 2) * 2}px)` }}
                  >
                    <TicketCard
                      colorName={c.colorName}
                      colorHex={c.colorHex}
                      letter={c.letter}
                      number={c.from}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{row.title}</p>
                <p className="truncate text-sm text-muted tabular-nums">{row.detail}</p>
                <p className="text-sm text-muted tabular-nums">{t.remainingOf(left, total)}</p>
              </div>
              <button
                type="button"
                onClick={() => row.books.forEach((b) => removeBook(b.id))}
                className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-bg-warm hover:text-primary"
                aria-label={t.removeBook(row.title)}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
