import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { DrawOverlay } from "@/components/draw-overlay";
import { TicketCard } from "@/components/ticket-card";
import { Button } from "@/components/ui/button";
import { getDrawMuted, setDrawMuted, unlockDrawAudio } from "@/lib/draw-audio";
import { useI18n } from "@/lib/i18n";
import { expandPool } from "@/lib/tickets";
import type { Winner } from "@/lib/types";
import { useRaffleStore } from "@/lib/store";

export function DrawStage() {
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const prizes = useRaffleStore((s) => s.prizes);
  const winners = useRaffleStore((s) => s.winners);
  const draw = useRaffleStore((s) => s.draw);
  const remaining = expandPool(books, drawnKeys).length;
  const last = winners[0];
  const nextPrize = prizes[0];
  const [live, setLive] = useState<{ winner: Winner; remaining: number } | null>(null);
  const [muted, setMuted] = useState(false);
  const { t } = useI18n();

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
