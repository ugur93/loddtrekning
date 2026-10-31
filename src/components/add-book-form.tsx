import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TicketCard } from "@/components/ticket-card";
import { PALETTE, colorFromName, colorLabel, ticketInk } from "@/lib/colors";
import { useI18n } from "@/lib/i18n";
import { useRaffleStore } from "@/lib/store";
import {
  BOOK_COLORS,
  BOOK_FROM,
  BOOK_LETTERS,
  BOOK_TO,
  bookFromParsed,
  formatNumber,
  parseBookLines,
} from "@/lib/tickets";
import { cn } from "@/lib/utils";

type PickedColor = { name: string; hex: string };

const bookColors: PickedColor[] = BOOK_COLORS.map((name) => {
  const c = colorFromName(name)!;
  return { name: c.name, hex: c.hex };
});

export function AddBookForm() {
  const addBooks = useRaffleStore((s) => s.addBooks);
  const [colors, setColors] = useState<PickedColor[]>(bookColors);
  const [customName, setCustomName] = useState("");
  const [customHex, setCustomHex] = useState("#B0A8D8");
  const [letters, setLetters] = useState<string[]>(["A"]);
  const [from, setFrom] = useState(BOOK_FROM);
  const [to, setTo] = useState(BOOK_TO);
  const [bulk, setBulk] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const { locale, t } = useI18n();

  const bulkCount = useMemo(
    () => parseBookLines(bulk).reduce((sum, row) => sum + row.to - row.from + 1, 0),
    [bulk],
  );
  const rangeOk = from >= 1 && to >= from && to <= 9999;
  const ticketCount = rangeOk ? colors.length * letters.length * (to - from + 1) : 0;
  const isPicked = (name: string) => colors.some((c) => c.name === name);

  function toggleColor(color: PickedColor) {
    setColors((cur) =>
      cur.some((c) => c.name === color.name)
        ? cur.filter((c) => c.name !== color.name)
        : [...cur, color],
    );
  }

  function addCustomColor() {
    const name = customName.trim();
    if (!name) return;
    const known = colorFromName(name);
    const color = known ? { name: known.name, hex: known.hex } : { name, hex: customHex };
    if (!isPicked(color.name)) setColors((cur) => [...cur, color]);
    setCustomName("");
  }

  function toggleLetter(l: string) {
    setLetters((cur) =>
      cur.includes(l)
        ? cur.filter((x) => x !== l)
        : [...cur, l].sort((a, b) => BOOK_LETTERS.indexOf(a) - BOOK_LETTERS.indexOf(b)),
    );
  }

  function submitBook() {
    if (colors.length === 0 || letters.length === 0) {
      toast.error(t.needColor);
      return;
    }
    if (!rangeOk) {
      toast.error(t.badRange);
      return;
    }
    reportAdded(
      addBooks(
        letters.flatMap((letter) =>
          colors.map((c) => ({ colorName: c.name, colorHex: c.hex, letter, from, to })),
        ),
      ),
    );
  }

  function submitBulk() {
    const parsed = parseBookLines(bulk);
    if (parsed.length === 0) {
      toast.error(t.badLines);
      return;
    }
    reportAdded(addBooks(parsed.map(bookFromParsed)));
    setBulk("");
    setShowBulk(false);
  }

  function reportAdded({ added, skipped }: { added: number; skipped: number }) {
    if (added === 0) toast.error(t.allExisted(skipped));
    else if (skipped > 0) toast.success(`${t.addedTickets(added)}. ${t.someExisted(skipped)}`);
    else toast.success(t.addedTickets(added));
  }

  const customColors = colors.filter((c) => !PALETTE.some((p) => p.name === c.name));

  return (
    <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl tracking-tight">{t.booksTitle}</h2>
          <p className="text-sm text-muted">{t.booksHint}</p>
        </div>
        <button
          type="button"
          className="shrink-0 text-sm text-muted underline-offset-2 hover:text-fg hover:underline"
          onClick={() => setShowBulk((v) => !v)}
        >
          {showBulk ? t.formToggle : t.bulkToggle}
        </button>
      </div>

      {showBulk ? (
        <div className="grid gap-3">
          <Label htmlFor="bulk">{t.onePerLine}</Label>
          <p className="-mt-2 text-xs text-muted">{t.bulkHint}</p>
          <textarea
            id="bulk"
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            rows={6}
            placeholder={t.bulkPlaceholder}
            className="w-full resize-y rounded-md bg-bg px-3 py-2 font-mono text-sm text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <Button onClick={submitBulk} disabled={bulkCount === 0}>
            {t.addBulk(bulkCount)}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label>{t.colors}</Label>
              <button
                type="button"
                onClick={() => setColors(bookColors)}
                className="h-8 rounded-sm bg-bg-warm px-2.5 text-xs text-muted hover:text-fg"
              >
                {t.bookColors}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[...PALETTE, ...customColors].map((c) => {
                const active = isPicked(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleColor({ name: c.name, hex: c.hex })}
                    className={cn(
                      "flex h-11 items-center gap-2 rounded-sm px-2.5 text-sm",
                      "shadow-[var(--shadow-border)]",
                      active
                        ? "ring-2 ring-fg ring-offset-2 ring-offset-surface"
                        : "opacity-60 hover:opacity-100",
                    )}
                    style={{ background: c.hex, color: ticketInk(c.hex) }}
                  >
                    {colorLabel(c.name, locale)}
                  </button>
                );
              })}
            </div>
            <div className="mt-1 grid grid-cols-[1fr_auto_auto] gap-2">
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
                placeholder={t.otherColor}
                aria-label={t.otherColor}
              />
              <label
                className="relative size-11 overflow-hidden rounded-md shadow-[var(--shadow-border)]"
                style={{ backgroundColor: customHex }}
              >
                <span className="sr-only">{t.pickColor}</span>
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => setCustomHex(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </label>
              <Button variant="secondary" onClick={addCustomColor} disabled={!customName.trim()}>
                {t.addColor}
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label>{t.bookLetter}</Label>
              <div className="flex items-center gap-1 text-xs">
                <span className="mr-1 text-muted">{t.lettersPicked(letters.length)}</span>
                <button
                  type="button"
                  onClick={() => setLetters(BOOK_LETTERS)}
                  className="h-8 rounded-sm bg-bg-warm px-2.5 text-muted hover:text-fg"
                >
                  {t.letterAll}
                </button>
                <button
                  type="button"
                  onClick={() => setLetters([])}
                  className="h-8 rounded-sm bg-bg-warm px-2.5 text-muted hover:text-fg"
                >
                  {t.letterNone}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 sm:grid-cols-9">
              {BOOK_LETTERS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={letters.includes(l)}
                  onClick={() => toggleLetter(l)}
                  className={cn(
                    "grid h-11 place-items-center rounded-sm font-ticket text-sm shadow-[var(--shadow-border)]",
                    letters.includes(l) ? "bg-fg text-bg" : "bg-surface text-fg hover:bg-bg-warm",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="from">{t.from}</Label>
              <Input
                id="from"
                type="number"
                min={1}
                max={9999}
                value={from}
                onChange={(e) => setFrom(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="to">{t.to}</Label>
              <Input
                id="to"
                type="number"
                min={1}
                max={9999}
                value={to}
                onChange={(e) => setTo(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              [1, 25],
              [1, 10],
              [1, 50],
              [1, 100],
            ].map(([a, b]) => (
              <button
                key={`${a}-${b}`}
                type="button"
                onClick={() => {
                  setFrom(a!);
                  setTo(b!);
                }}
                className={cn(
                  "h-8 rounded-sm px-2.5 text-xs",
                  from === a && to === b ? "bg-fg text-bg" : "bg-bg-warm text-muted hover:text-fg",
                )}
              >
                {formatNumber(a!)}–{formatNumber(b!)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex -space-x-24">
              {(colors.length ? colors : [{ name: t.color, hex: "#d9d2c5" }])
                .slice(0, 4)
                .map((c, i) => (
                  <div key={c.name} style={{ transform: `translateY(${i * 4}px)` }}>
                    <TicketCard
                      colorName={c.name}
                      colorHex={c.hex}
                      letter={letters[0] ?? "?"}
                      number={from}
                      size="md"
                    />
                  </div>
                ))}
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className="text-sm text-muted tabular-nums">{t.ticketsToAdd(ticketCount)}</p>
              <Button onClick={submitBook} className="min-w-40" disabled={ticketCount === 0}>
                <Plus className="size-4" />
                {t.addBook}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
