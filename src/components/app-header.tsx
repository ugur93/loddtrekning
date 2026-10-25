import { Monitor, RotateCcw, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LocaleSwitch } from "@/components/locale-switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { expandPool } from "@/lib/tickets";
import { useRaffleStore } from "@/lib/store";

export function AppHeader() {
  const eventName = useRaffleStore((s) => s.eventName);
  const setEventName = useRaffleStore((s) => s.setEventName);
  const books = useRaffleStore((s) => s.books);
  const drawnKeys = useRaffleStore((s) => s.drawnKeys);
  const winners = useRaffleStore((s) => s.winners);
  const undoLast = useRaffleStore((s) => s.undoLast);
  const newRound = useRaffleStore((s) => s.newRound);
  const resetAll = useRaffleStore((s) => s.resetAll);
  const stageMode = useRaffleStore((s) => s.stageMode);
  const setStageMode = useRaffleStore((s) => s.setStageMode);
  const remaining = expandPool(books, drawnKeys).length;
  const [confirm, setConfirm] = useState<"round" | "reset" | null>(null);
  const { t } = useI18n();

  return (
    <header className="flex flex-col gap-4 border-b border-border/80 pb-5">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{t.appTitle}</h1>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <LocaleSwitch />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStageMode(!stageMode)}
            aria-pressed={stageMode}
          >
            <Monitor className="size-4" />
            {t.stageScreen}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={winners.length === 0}
            onClick={() => {
              undoLast();
              toast(t.undoToast);
            }}
          >
            <Undo2 className="size-4" />
            {t.undo}
          </Button>
          {confirm === "round" ? (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  newRound();
                  setConfirm(null);
                  toast(t.roundToast);
                }}
              >
                {t.confirmRound}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
                {t.cancel}
              </Button>
            </>
          ) : confirm === "reset" ? (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  resetAll();
                  setConfirm(null);
                  toast(t.resetToast);
                }}
              >
                {t.confirmReset}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirm(null)}>
                {t.cancel}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setConfirm("round")}>
                <RotateCcw className="size-4" />
                {t.newRound}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted" onClick={() => setConfirm("reset")}>
                {t.resetAll}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:gap-6">
        <label className="grid min-w-0 flex-1 gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">{t.eventLabel}</span>
          <Input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            aria-label={t.eventLabel}
            className="min-w-0 max-w-md"
          />
        </label>
        <p className="text-sm text-muted tabular-nums sm:pb-2.5">
          {t.remaining(remaining)}
          {winners.length ? ` · ${t.drawnCount(winners.length)}` : ""}
          {books.length ? ` · ${t.bookCount(books.length)}` : ""}
        </p>
      </div>
    </header>
  );
}
