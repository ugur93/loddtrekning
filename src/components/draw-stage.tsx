import { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { DrawOverlay } from "@/components/draw-overlay";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { getDrawMuted, setDrawMuted, unlockDrawAudio } from "@/lib/draw-audio";
import { useI18n } from "@/lib/i18n";
import { colorLabel } from "@/lib/colors";
import { colorChances } from "@/lib/fair-draw";
import { expandPool } from "@/lib/tickets";
import type { Winner } from "@/lib/types";
import { useRaffleStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DrawStage() {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const prizes = useRaffleStore((s) => s.prizes);
  const winners = useRaffleStore((s) => s.winners);
  const draw = useRaffleStore((s) => s.draw);
  const drawMode = useRaffleStore((s) => s.drawMode);
  const setDrawMode = useRaffleStore((s) => s.setDrawMode);
  const pool = useMemo(() => expandPool(books, drawnKeys), [books, drawnKeys]);
  const remaining = pool.length;
  const chances = useMemo(
    () => (pool.length ? colorChances(pool, winners, drawMode) : []),
    [pool, winners, drawMode],
  );
  const last = winners[0];
  const nextPrize = prizes[0];
  const [live, setLive] = useState<{ winner: Winner; remaining: number } | null>(null);
  const [muted, setMuted] = useState(false);
  const { locale, t } = useI18n();

  useEffect(() => {
    setMuted(getDrawMuted());
  }, [live]);

  function runDraw() {
    unlockDrawAudio();
    const result = draw();
    if (!result.ok) {
      toast.error(result.reason === "empty" ? t.needBooks : t.noneLeft);
      return;
    }
    setLive({ winner: result.winner, remaining: result.remaining });
  }

  function toggleMute() {
    unlockDrawAudio();
    const next = !getDrawMuted();
    setDrawMuted(next);
    setMuted(next);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-xl bg-stage px-4 py-8 text-stage-fg shadow-[var(--shadow-border)] sm:px-8 sm:py-10">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 40%, rgb(244 239 230 / 0.07), transparent 60%)",
          }}
        />
        <button
          type="button"
          onClick={toggleMute}
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-md text-stage-muted hover:bg-stage-fg/10 hover:text-stage-fg"
          aria-label={muted ? t.soundOn : t.soundOff}
          aria-pressed={!muted}
        >
          {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
        </button>
        <div className="relative flex flex-col items-center text-center">
          <p className="text-xs tracking-widest text-stage-muted uppercase">{t.nextDraw}</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">{t.drawWinner}</h2>
          <p className="mt-2 max-w-md text-sm text-stage-muted">{t.among(remaining)}</p>

          {nextPrize ? (
            <div className="mt-5 flex items-center gap-3 rounded-lg bg-stage-fg/10 px-3 py-2 text-left">
              {nextPrize.imageDataUrl ? (
                <img
                  src={nextPrize.imageDataUrl}
                  alt=""
                  className="size-12 rounded-md object-cover"
                />
              ) : null}
              <div>
                <p className="text-xs tracking-wide text-stage-muted uppercase">{t.prizeQueued}</p>
                <p className="font-medium">{nextPrize.name}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-stage-muted">{t.noPrize}</p>
          )}

          <Button
            variant="stage"
            size="lg"
            className="mt-8 min-h-14 min-w-52 px-10 text-xl"
            onClick={runDraw}
            disabled={remaining === 0}
          >
            {t.drawWinner}
          </Button>

          <div className="mt-6 w-full max-w-md">
            <div
              role="radiogroup"
              aria-label={t.drawMode}
              className="mx-auto grid w-fit grid-cols-2 gap-1 rounded-md bg-stage-fg/10 p-1 text-sm"
            >
              {(["balanced", "random"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  role="radio"
                  aria-checked={drawMode === mode}
                  onClick={() => setDrawMode(mode)}
                  className={cn(
                    "h-9 rounded-sm px-3",
                    drawMode === mode
                      ? "bg-stage-fg text-stage"
                      : "text-stage-muted hover:text-stage-fg",
                  )}
                >
                  {mode === "balanced" ? t.balanced : t.pureRandom}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stage-muted">
              {drawMode === "balanced" ? t.balancedHint : t.randomHint}
            </p>
            {chances.length > 1 ? (
              <div className="mt-4 text-left">
                <p className="mb-1.5 text-center text-xs tracking-widest text-stage-muted uppercase">
                  {t.chanceNext}
                </p>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-stage-fg/10">
                  {chances.map((c) => (
                    <div
                      key={c.colorName}
                      className="h-full transition-[width] duration-500"
                      style={{ width: `${c.chance * 100}%`, backgroundColor: c.colorHex }}
                    />
                  ))}
                </div>
                <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-stage-muted tabular-nums">
                  {chances.map((c) => (
                    <li key={c.colorName} className="flex items-center gap-1.5">
                      <span
                        className="size-2.5 rounded-full shadow-[0_0_0_1px_rgb(255_255_255/0.25)]"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      {colorLabel(c.colorName, locale)} {Math.round(c.chance * 100)}%
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {last && !live ? (
            <div className="mt-10">
              <p className="mb-3 text-xs tracking-widest text-stage-muted uppercase">{t.lastDrawn}</p>
              <TicketCard
                colorName={last.colorName}
                colorHex={last.colorHex}
                letter={last.letter}
                number={last.number}
                size="lg"
              />
              {last.prizeName ? (
                <p className="mt-3 text-sm text-stage-muted">{last.prizeName}</p>
              ) : null}
            </div>
          ) : remaining === 0 && books.length > 0 ? (
            <p className="mt-8 text-sm text-stage-muted">{t.allDrawn}</p>
          ) : null}
        </div>
      </section>

      {live ? (
        <DrawOverlay
          winner={live.winner}
          remaining={live.remaining}
          onClose={() => setLive(null)}
          onDrawAgain={() => {
            unlockDrawAudio();
            const result = draw();
            if (!result.ok) {
              toast.error(t.noneLeft);
              setLive(null);
              return;
            }
            setLive({ winner: result.winner, remaining: result.remaining });
          }}
        />
      ) : null}
    </>
  );
}
