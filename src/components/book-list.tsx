import { Trash2 } from "lucide-react";
import { TicketCard } from "@/components/ticket-card";
import { colorLabel } from "@/lib/colors";
import { useI18n } from "@/lib/i18n";
import { BOOK_LETTERS, bookSize, formatNumber, remainingInBook } from "@/lib/tickets";
import type { TicketBook } from "@/lib/types";
import { useRaffleStore } from "@/lib/store";

/** "A,B,C,D,F" → "A–D, F" using book letter order. */
function compactLetters(letters: string[]) {
  const order = (l: string) => {
    const i = BOOK_LETTERS.indexOf(l);
    return i < 0 ? Number.POSITIVE_INFINITY : i;
  };
  const sorted = [...new Set(letters)].sort((a, b) => order(a) - order(b) || a.localeCompare(b));
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && order(sorted[j + 1]!) === order(sorted[j]!) + 1) j++;
    parts.push(j - i >= 2 ? `${sorted[i]}–${sorted[j]}` : sorted.slice(i, j + 1).join(", "));
    i = j + 1;
  }
  return parts.join(", ");
}

type Group = { key: string; letters: string[]; colors: TicketBook[]; books: TicketBook[] };

/** One row per set of books that share colors and range: "Bok A–C · Rosa, Grønn, Gul, Blå · 01–25". */
function groupBooks(books: TicketBook[]): Group[] {
  const byLetter = new Map<string, TicketBook[]>();
  for (const book of books) {
    const key = `${book.letter}|${book.from}|${book.to}`;
    byLetter.set(key, [...(byLetter.get(key) ?? []), book]);
  }
  const groups = new Map<string, Group>();
  for (const rows of byLetter.values()) {
    const first = rows[0]!;
    const colorKey = rows.map((b) => `${b.colorName.trim().toUpperCase()}:${b.colorHex}`).join(",");
    const key = `${first.from}|${first.to}|${colorKey}`;
    const group = groups.get(key) ?? { key, letters: [], colors: rows, books: [] };
    group.letters.push(first.letter);
    group.books.push(...rows);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function BookList() {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const removeBook = useRaffleStore((s) => s.removeBook);
  const { locale, t } = useI18n();

  if (books.length === 0) {
    return <p className="px-1 text-sm text-muted">{t.noBooks}</p>;
  }

  const drawn = new Set(drawnKeys);

  return (
    <ul className="grid gap-2">
      {groupBooks(books).map(({ key, letters: bookLetters, colors, books: rows }) => {
        const first = rows[0]!;
        const left = rows.reduce((sum, b) => sum + remainingInBook(b, drawn), 0);
        const total = rows.reduce((sum, b) => sum + bookSize(b), 0);
        const letters = compactLetters(bookLetters);
        const colorNames = colors.map((c) => colorLabel(c.colorName, locale)).join(", ");
        const range =
          first.from === first.to
            ? formatNumber(first.from)
            : `${formatNumber(first.from)}–${formatNumber(first.to)}`;
        return (
          <li
            key={key}
            className="flex items-center gap-3 rounded-lg bg-surface p-2 pl-2.5 shadow-[var(--shadow-border)]"
          >
            <div className="flex shrink-0 -space-x-[6.5rem] pr-1" aria-hidden>
              {colors.slice(0, 4).map((c, i) => (
                <div key={c.id} style={{ transform: `translateY(${(i - 1.5) * 2}px)` }}>
                  <TicketCard
                    colorName={c.colorName}
                    colorHex={c.colorHex}
                    letter={bookLetters.length > 1 ? "•" : first.letter}
                    number={first.from}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {t.bookLabel(letters, bookLetters.length)} · <span className="tabular-nums">{range}</span>
              </p>
              <p className="truncate text-sm text-muted">{colorNames}</p>
              <p className="text-sm text-muted tabular-nums">{t.remainingOf(left, total)}</p>
            </div>
            <button
              type="button"
              onClick={() => rows.forEach((b) => removeBook(b.id))}
              className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-bg-warm hover:text-primary"
              aria-label={t.removeBook(letters)}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
