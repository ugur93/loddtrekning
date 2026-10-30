import { useState } from "react";
import { Presentation, X } from "lucide-react";
import { WinnersRail } from "@/components/draw-overlay";
import { DrawStage } from "@/components/draw-stage";
import { FullscreenButton } from "@/components/fullscreen-button";
import { LocaleSwitch } from "@/components/locale-switch";
import { WinnersBoard } from "@/components/winners-board";
import { useI18n } from "@/lib/i18n";
import { useRaffleStore } from "@/lib/store";

export function StageMode() {
  const setStageMode = useRaffleStore((s) => s.setStageMode);
  const winners = useRaffleStore((s) => s.winners);
  const eventName = useRaffleStore((s) => s.eventName);
  const [board, setBoard] = useState(false);
  const { t } = useI18n();

  return (
    <div className="flex min-h-dvh flex-col bg-stage text-stage-fg">
      <header className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-stage-muted uppercase">{t.appTitle}</p>
          <p className="font-display text-xl tracking-tight">{eventName}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBoard(true)}
            disabled={winners.length === 0}
            className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm text-stage-muted hover:bg-stage-fg/10 hover:text-stage-fg disabled:opacity-40"
          >
            <Presentation className="size-4" />
            {t.showBoard}
          </button>
          <LocaleSwitch tone="stage" />
          <FullscreenButton tone="stage" />
          <button
            type="button"
            onClick={() => setStageMode(false)}
            className="inline-flex h-11 items-center gap-2 px-3 text-sm text-stage-muted hover:text-stage-fg"
          >
            <X className="size-4" />
            {t.exitStage}
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-4 pb-6">
          <DrawStage />
        </div>
        <WinnersRail winners={winners} />
      </div>
      {board ? <WinnersBoard onClose={() => setBoard(false)} /> : null}
    </div>
  );
}
