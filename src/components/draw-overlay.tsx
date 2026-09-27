import { useEffect, useMemo, useState } from "react";
import { ConfettiCanvas } from "@/components/confetti-canvas";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { expandPool } from "@/lib/tickets";
import type { Winner } from "@/lib/types";
import { useRaffleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type Phase = "spin" | "reveal";

type Props = {
  winner: Winner;
  remaining: number;
  onClose: () => void;
  onDrawAgain: () => void;
};

function Reel({
  items,
  itemHeight,
  className,
  variant,
}: {
  items: string[];
  itemHeight: number;
  className?: string;
  variant: "color" | "letter" | "number";
}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOffset((items.length - 1) * itemHeight);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [items.length, itemHeight]);

  return (
      <div
      className="relative overflow-hidden rounded-md bg-stage-fg/5"
      style={{ height: itemHeight }}
    >
      <div
        className={cn(
          "reel-spin will-change-transform",
          variant === "letter" && "delay-letter",
          variant === "number" && "delay-number",
        )}
        style={{ transform: `translateY(-${offset}px)` }}
      >
        {items.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className={cn(
              "flex items-center justify-center font-ticket tracking-tight text-stage-fg",
              className,
            )}
            style={{ height: itemHeight }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function buildStrip(options: string[], winner: string, spins: number) {
  const pool = options.length ? options : [winner];
  const strip: string[] = [];
  for (let s = 0; s < spins; s++) {
    for (let i = 0; i < pool.length; i++) {
      strip.push(pool[(i + s) % pool.length]!);
    }
  }
  if (strip[strip.length - 1] === winner) strip.push(pool[0] ?? winner);
  strip.push(winner);
  return strip;
}

export function DrawOverlay({ winner, remaining, onClose, onDrawAgain }: Props) {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const [phase, setPhase] = useState<Phase>("spin");
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const samples = useMemo(() => {
    const pool = expandPool(books, drawnKeys);
    if (pool.length === 0) {
      return books.slice(0, 12).map((b, i) => ({
        key: `${b.id}-s${i}`,
        colorName: b.colorName,
        colorHex: b.colorHex,
        letter: b.letter,
        number: b.from + (i % Math.max(1, b.to - b.from + 1)),
      }));
    }
    const out = [];
    const n = Math.min(14, Math.max(8, pool.length));
    for (let i = 0; i < n; i++) {
      const t = pool[i % pool.length]!;
      out.push(t);
    }
    return out;
  }, [books, drawnKeys]);

  const colorOpts = useMemo(
    () => Array.from(new Set(books.map((b) => b.colorName.toUpperCase()))),
    [books],
  );
  const letterOpts = useMemo(
    () => Array.from(new Set(books.map((b) => b.letter.toUpperCase()))),
    [books],
  );
  const numberOpts = useMemo(() => {
    const nums: string[] = [];
    for (let i = 0; i < 18; i++) {
      const n = 1 + ((winner.number * 7 + i * 13) % 100);
      nums.push(String(n).padStart(3, "0"));
    }
    return nums;
  }, [winner.number]);

  const colorStrip = useMemo(
    () => buildStrip(colorOpts, winner.colorName.toUpperCase(), 3),
    [colorOpts, winner.colorName],
  );
  const letterStrip = useMemo(
    () => buildStrip(letterOpts, winner.letter.toUpperCase(), 4),
    [letterOpts, winner.letter],
  );
  const numberStrip = useMemo(
    () => buildStrip(numberOpts, String(winner.number).padStart(3, "0"), 3),
    [numberOpts, winner.number],
  );

  const confettiColors = useMemo(
    () => [...new Set([...books.map((b) => b.colorHex), winner.colorHex, "#f4efe6", "#9f1d2c"])],
    [books, winner.colorHex],
  );

  useEffect(() => {
    if (reduced) {
      setPhase("reveal");
      return;
    }
    const t = window.setTimeout(() => setPhase("reveal"), 3300);
    return () => window.clearTimeout(t);
  }, [reduced, winner.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "reveal") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, phase]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-stage text-stage-fg"
      role="dialog"
      aria-modal="true"
      aria-label="Loddtrekning"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 42%, rgb(244 239 230 / 0.08), transparent 62%)",
        }}
      />
      <ConfettiCanvas active={phase === "reveal"} colors={confettiColors} />

      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <p className="text-sm tracking-wide text-stage-muted uppercase">Loddtrekning</p>
        {phase === "reveal" ? (
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-3 text-sm text-stage-muted hover:text-stage-fg"
          >
            Lukk
          </button>
        ) : (
          <p className="text-sm text-stage-muted">Trekker blant gjenværende lodd…</p>
        )}
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8">
        {phase === "spin" ? (
          <>
            <div className="relative mb-8 grid size-[15.5rem] place-items-center overflow-hidden sm:size-[18rem]">
              <div className="orbit-spin pointer-events-none absolute inset-0">
                {samples.map((t, i) => {
                  const angle = (360 / samples.length) * i;
                  return (
                    <div
                      key={t.key}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-5.6rem) rotate(${-angle}deg)`,
                      }}
                    >
                      <TicketCard
                        colorName={t.colorName}
                        colorHex={t.colorHex}
                        letter={t.letter}
                        number={t.number}
                        size="sm"
                        className="scale-75 opacity-75"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="relative font-display text-lg text-stage-muted">Tombola</p>
            </div>

            <div className="grid w-full max-w-lg grid-cols-3 gap-2 rounded-xl bg-stage-fg/10 p-3 sm:gap-3 sm:p-4">
              <div className="min-w-0">
                <p className="mb-1.5 text-center text-xs tracking-widest text-stage-muted uppercase">
                  Farge
                </p>
                <Reel items={colorStrip} itemHeight={72} variant="color" className="px-1 text-xl sm:text-2xl" />
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-center text-xs tracking-widest text-stage-muted uppercase">
                  Bokstav
                </p>
                <Reel items={letterStrip} itemHeight={72} variant="letter" className="text-4xl" />
              </div>
              <div className="min-w-0">
                <p className="mb-1.5 text-center text-xs tracking-widest text-stage-muted uppercase">
                  Nummer
                </p>
                <Reel items={numberStrip} itemHeight={72} variant="number" className="text-4xl tabular-nums" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex w-full max-w-lg flex-col items-center text-center">
            <p className="rise-in text-sm tracking-[0.2em] text-stage-muted uppercase">Vinneren er</p>
            <div className="ticket-pop mt-5">
              <TicketCard
                colorName={winner.colorName}
                colorHex={winner.colorHex}
                letter={winner.letter}
                number={winner.number}
                size="hero"
              />
            </div>
            <p className="rise-in stagger-2 mt-6 font-display text-3xl tracking-tight sm:text-4xl">
              {winner.colorName} {winner.letter}{" "}
              <span className="tabular-nums">{String(winner.number).padStart(3, "0")}</span>
            </p>
            {winner.prizeName || winner.prizeImage ? (
              <div className="rise-in stagger-3 mt-5 flex items-center gap-3 rounded-lg bg-stage-fg/10 px-4 py-3">
                {winner.prizeImage ? (
                  <img
                    src={winner.prizeImage}
                    alt=""
                    className="size-16 rounded-md object-cover"
                  />
                ) : null}
                <div className="text-left">
                  <p className="text-xs tracking-wide text-stage-muted uppercase">Premie</p>
                  <p className="font-medium">{winner.prizeName ?? "Premie"}</p>
                </div>
              </div>
            ) : null}
            <p className="mt-4 text-sm text-stage-muted tabular-nums">{remaining} lodd igjen i puljen</p>
            <div className="mt-8 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Button variant="stage" size="lg" onClick={onDrawAgain} disabled={remaining === 0}>
                Trekk neste
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="text-stage-fg hover:bg-stage-fg/10"
                onClick={onClose}
              >
                Ferdig
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
